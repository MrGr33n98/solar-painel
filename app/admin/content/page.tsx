"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save,
  Calendar,
  User,
  Globe,
  BookOpen
} from 'lucide-react';

export default function ContentManagementPage() {
  const [pages, setPages] = useState([
    {
      id: '1',
      title: 'Sobre Nós',
      slug: 'sobre-nos',
      content: 'Somos o maior marketplace de energia solar do Brasil...',
      status: 'published',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '2',
      title: 'Como Funciona',
      slug: 'como-funciona',
      content: 'Nosso marketplace conecta compradores e vendedores...',
      status: 'published',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: '3',
      title: 'FAQ - Perguntas Frequentes',
      slug: 'faq',
      content: 'Encontre respostas para as principais dúvidas...',
      status: 'draft',
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25')
    }
  ]);

  const [blogPosts, setBlogPosts] = useState([
    {
      id: '1',
      title: 'Energia Solar no Brasil: Crescimento de 300% em 2024',
      slug: 'energia-solar-brasil-crescimento-2024',
      excerpt: 'O setor de energia solar fotovoltaica no Brasil registrou um crescimento excepcional...',
      content: 'Conteúdo completo do artigo...',
      author: 'Equipe SolarHub',
      category: 'Mercado',
      status: 'published',
      featured: true,
      publishedAt: new Date('2024-01-20'),
      createdAt: new Date('2024-01-18')
    },
    {
      id: '2',
      title: 'Como Calcular o ROI de um Sistema Solar Fotovoltaico',
      slug: 'como-calcular-roi-sistema-solar',
      excerpt: 'Aprenda a calcular o retorno sobre investimento de um sistema de energia solar...',
      content: 'Conteúdo completo do artigo...',
      author: 'Equipe SolarHub',
      category: 'Educacional',
      status: 'published',
      featured: false,
      publishedAt: new Date('2024-01-22'),
      createdAt: new Date('2024-01-20')
    }
  ]);

  const [selectedTab, setSelectedTab] = useState('pages');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    status: 'draft',
    featured: false
  });

  const handleEdit = (item, type) => {
    setEditingItem({ ...item, type });
    setFormData({
      title: item.title,
      slug: item.slug,
      content: item.content,
      excerpt: item.excerpt || '',
      category: item.category || '',
      status: item.status,
      featured: item.featured || false
    });
  };

  const handleSave = () => {
    if (editingItem) {
      const updatedItem = {
        ...editingItem,
        ...formData,
        updatedAt: new Date()
      };

      if (editingItem.type === 'page') {
        setPages(pages.map(p => p.id === editingItem.id ? updatedItem : p));
      } else {
        setBlogPosts(blogPosts.map(p => p.id === editingItem.id ? updatedItem : p));
      }
    } else {
      // Create new
      const newItem = {
        id: Date.now().toString(),
        ...formData,
        author: 'Equipe SolarHub',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (selectedTab === 'pages') {
        setPages([newItem, ...pages]);
      } else {
        setBlogPosts([newItem, ...blogPosts]);
      }
    }

    setEditingItem(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: '',
      status: 'draft',
      featured: false
    });
    alert('Conteúdo salvo com sucesso!');
  };

  const handleDelete = (id, type) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      if (type === 'page') {
        setPages(pages.filter(p => p.id !== id));
      } else {
        setBlogPosts(blogPosts.filter(p => p.id !== id));
      }
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Conteúdo</h1>
          <p className="text-gray-600 mt-1">
            Gerencie páginas estáticas e posts do blog
          </p>
        </div>
        <Button onClick={() => setEditingItem(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Conteúdo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Páginas Publicadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.filter(p => p.status === 'published').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Posts do Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogPosts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Posts em Destaque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogPosts.filter(p => p.featured).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rascunhos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {[...pages, ...blogPosts].filter(p => p.status === 'draft').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Conteúdo</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={selectedTab === 'pages' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTab('pages')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Páginas
                  </Button>
                  <Button
                    variant={selectedTab === 'blog' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTab('blog')}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Blog
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedTab === 'pages' ? (
                  pages.map((page) => (
                    <div key={page.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{page.title}</h3>
                        <Badge className={getStatusColor(page.status)}>
                          {page.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        Slug: /{page.slug}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        Atualizado em {page.updatedAt.toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(page, 'page')}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Visualizar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(page.id, 'page')}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  blogPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{post.title}</h3>
                        <div className="flex space-x-2">
                          {post.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Destaque
                            </Badge>
                          )}
                          <Badge className={getStatusColor(post.status)}>
                            {post.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {post.excerpt}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        <span>Por {post.author}</span> • 
                        <span> {post.category}</span> • 
                        <span> {post.publishedAt?.toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post, 'blog')}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Visualizar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(post.id, 'blog')}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editor */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {editingItem ? 'Editar' : 'Novo'} {selectedTab === 'pages' ? 'Página' : 'Post'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({
                      ...formData,
                      title,
                      slug: formData.slug || generateSlug(title)
                    });
                  }}
                  placeholder="Título do conteúdo"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="url-amigavel"
                />
              </div>

              {selectedTab === 'blog' && (
                <>
                  <div>
                    <Label htmlFor="excerpt">Resumo</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      placeholder="Breve descrição do post..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione</option>
                      <option value="Mercado">Mercado</option>
                      <option value="Educacional">Educacional</option>
                      <option value="Tecnologia">Tecnologia</option>
                      <option value="Sustentabilidade">Sustentabilidade</option>
                      <option value="Regulamentação">Regulamentação</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    />
                    <Label htmlFor="featured">Post em destaque</Label>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Conteúdo completo..."
                  rows={10}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                  <option value="scheduled">Agendado</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                {editingItem && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingItem(null);
                      setFormData({
                        title: '',
                        slug: '',
                        content: '',
                        excerpt: '',
                        category: '',
                        status: 'draft',
                        featured: false
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}