"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AnnouncementDetail from '@/components/AnnouncementDetail';
import { 
  Megaphone, 
  Calendar, 
  Clock, 
  User, 
  Search,
  Eye,
  ArrowRight
} from 'lucide-react';

interface Article {
  id: number;
  judul: string;
  isi: string;
  excerpt: string;
  author: string;
  tanggal: string;
  category: string;
  gambar?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  featured?: boolean;
}

interface ApiArticle {
  id: number;
  judul: string;
  isi: string;
  author?: string;
  tanggal: string;
  category?: string;
  gambar?: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
}





export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [articlesData, setArticlesData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDetailArticle, setSelectedDetailArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<string[]>(['Semua', 'Pengumuman', 'Pemberitahuan', 'Informasi Penting']);
  const itemsPerPage = 6;
  const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/pengumuman');
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          if (Array.isArray(data)) {
            const formattedArticles = data.map((item: ApiArticle) => {
              // Strip HTML tags for excerpt
              const plainText = item.isi.replace(/<[^>]*>/g, '');
              console.log('Item author:', item.author, 'Item:', item);
              
              return {
                id: item.id,
                judul: item.judul,
                isi: item.isi,
                excerpt: plainText.substring(0, 200) + '...',
                author: item.author || 'Admin SIM Keliling',
                tanggal: item.tanggal.split('T')[0],
                category: item.category || 'Pengumuman',
                gambar: item.gambar || 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=600',
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                views: item.views || 0,
                featured: item.category === 'Informasi Penting'
              };
            });
            setArticlesData(formattedArticles);
            
            // Extract unique categories
            const uniqueCategories = ['Semua', ...Array.from(new Set(formattedArticles.map((article: Article) => article.category)))].filter(Boolean);
            setCategories(uniqueCategories);
          }
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articlesData.filter(article => {
    const matchesCategory = selectedCategory === 'Semua' || article.category === selectedCategory;
    const plainContent = article.isi.replace(/<[^>]*>/g, '');
    const matchesSearch = article.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plainContent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    const dateA = new Date(a.tanggal).getTime();
    const dateB = new Date(b.tanggal).getTime();
    return sortOrder === 'terbaru' ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const handleReadMore = async (article: Article) => {
    try {
      const response = await fetch(`/api/pengumuman/${article.id}/views`, { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setArticlesData(prev => prev.map(a => 
          a.id === article.id ? { ...a, views: data.views } : a
        ));
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
    setSelectedDetailArticle(article);
    setShowDetail(true);
  };

  const getRelatedArticles = (currentArticle: Article) => {
    return articlesData
      .filter(article => 
        article.id !== currentArticle.id && 
        article.category === currentArticle.category
      )
      .slice(0, 3);
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedDetailArticle(null);
  };

  const featuredArticles = articlesData
    .filter(article => article.category === 'Informasi Penting')
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 2);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRelativeTime = (updatedAt: string, content: string) => {
  const now = new Date();
  const updated = new Date(updatedAt);
  const diffMs = now.getTime() - updated.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = updated.toDateString() === today.toDateString();
  const isYesterday = updated.toDateString() === yesterday.toDateString();

  if (diffMinutes < 60) {
    return diffMinutes <= 1 ? '1 Menit' : `${diffMinutes} Menit`;
  } else if (diffHours < 24 && isToday) {
    return diffHours === 1 ? '1 Jam' : `${diffHours} Jam`;
  } else if (isToday) {
    return 'Hari ini';
  } else if (isYesterday) {
    return '1 hari lalu';
  } else if (diffDays < 7) {
    return `${diffDays} hari lalu`;
  } else if (diffWeeks < 4) {
    return diffWeeks === 1 ? '1 minggu lalu' : `${diffWeeks} minggu lalu`;
  } else if (diffMonths < 12) {
    return diffMonths === 1 ? '1 bulan lalu' : `${diffMonths} bulan lalu`;
  } else {
    return 'Setahun lalu';
  }
};


  const getCategoryColor = (category: string) => {
    const colors = {
      'Pengumuman': 'bg-red-100 text-red-800',
      'Pemberitahuan': 'bg-orange-100 text-orange-800',
      'Informasi Penting': 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-green-100 text-green-800';
  };

  if (showDetail && selectedDetailArticle) {
    return (
      <AnnouncementDetail 
        article={selectedDetailArticle} 
        onBack={handleBackToList}
        relatedArticles={getRelatedArticles(selectedDetailArticle)}
        onReadMore={handleReadMore}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
            <Megaphone className="mr-4" size={48} />
            Pengumuman Resmi
          </h1>
          <p className="text-xl opacity-90">
            Pengumuman dan pemberitahuan resmi layanan SIM Keliling Kabupaten Garut
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari pengumuman..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#2622FF] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Articles */}
        {selectedCategory === 'Semua' && !searchTerm && currentPage === 1 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Pengumuman Penting</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <Image 
                    src={article.gambar || 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                    alt={article.judul}
                    width={600}
                    height={256}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Eye size={16} className="mr-1" />
                        <span>{article.views.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {article.judul}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        <span>{formatDate(article.tanggal)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2" />
                        <span>{getRelativeTime(article.updatedAt, article.isi)}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleReadMore(article)}
                      className="w-full bg-[#2622FF] hover:bg-blue-900 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      Baca Selengkapnya
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Articles */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {selectedCategory === 'Semua' ? 'Semua Pengumuman' : selectedCategory}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Urutkan:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'terbaru' | 'terlama')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="terlama">Terlama</option>
                </select>
              </div>
              <p className="text-gray-600">
                Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredArticles.length)} dari {filteredArticles.length} pengumuman
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 rounded w-28"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <Megaphone size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Tidak ada pengumuman ditemukan
              </h3>
              <p className="text-gray-500">
                Coba ubah kata kunci pencarian atau kategori
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <Image 
                    src={article.gambar || 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                    alt={article.judul}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Eye size={16} className="mr-1" />
                        <span>{article.views.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                      {article.judul}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User size={14} className="mr-1" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>{getRelativeTime(article.updatedAt, article.isi)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatDate(article.tanggal)}
                      </span>
                      <button 
                        onClick={() => handleReadMore(article)}
                        className="bg-[#2622FF] hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center"
                      >
                        Baca
                        <ArrowRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          )}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sebelumnya
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-[#2622FF] text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          
        </div>
      </div>
    </div>
  );
}