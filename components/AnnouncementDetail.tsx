import React from 'react';
import Image from 'next/image';
import 'quill/dist/quill.snow.css';
import '../styles/quill-content.css';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Eye,
  Phone,
  MessageCircle,
  Mail,
  Share2,
  ChevronRight
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
}

interface AnnouncementDetailProps {
  article: Article;
  onBack: () => void;
  relatedArticles?: Article[];
  onReadMore?: (article: Article) => void;
}

export default function AnnouncementDetail({ article, onBack, relatedArticles = [], onReadMore }: AnnouncementDetailProps) {
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
    } else if (diffDays <= 7) {
      return `${diffDays} hari lalu`;
    } else {
      const plainText = content.replace(/<[^>]*>/g, '');
      const wordCount = plainText.split(' ').length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));
      return `${readTime} menit`;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Pengumuman': 'bg-red-100 text-red-800',
      'Pemberitahuan': 'bg-orange-100 text-orange-800',
      'Informasi Penting': 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.judul,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link telah disalin ke clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Kembali ke Pengumuman</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(article.category)}`}>
                {article.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              {article.judul}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
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
              <div className="flex items-center">
                <Eye size={16} className="mr-2" />
                <span>{article.views.toLocaleString()} views</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Share2 size={16} />
                <span>Bagikan</span>
              </button>
            </div>
          </div>

          {article.gambar && (
            <div className="mb-8">
              <Image 
                src={article.gambar} 
                alt={article.judul}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none mb-12">
            <div 
              className="text-gray-700 leading-relaxed ql-editor"
              dangerouslySetInnerHTML={{ __html: article.isi }}
            />
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 rounded-xl p-6 mb-12">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              Butuh Informasi Lebih Lanjut?
            </h3>
            <p className="text-blue-700 mb-4">
              Hubungi kami untuk mendapatkan informasi lebih detail tentang layanan SIM Keliling
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:(0262)1500000"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Phone size={16} />
                <span>(0262) 1500-000</span>
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle size={16} />
                <span>WhatsApp</span>
              </a>
              <a
                href="mailto:info@simkelilinggarut.go.id"
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Mail size={16} />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Related Pengumuman */}
          {relatedArticles.length > 0 && (
            <div className="border-t border-gray-200 pt-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">
                Pengumuman Terkait
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <div key={relatedArticle.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <Image 
                      src={relatedArticle.gambar || 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                      alt={relatedArticle.judul}
                      width={400}
                      height={160}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <div className="mb-2">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(relatedArticle.category)}`}>
                          {relatedArticle.category}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {relatedArticle.judul}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{formatDate(relatedArticle.tanggal)}</span>
                        <span>{getRelativeTime(relatedArticle.updatedAt, relatedArticle.isi)}</span>
                      </div>
                      <button 
                        onClick={() => onReadMore?.(relatedArticle)}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                      >
                        <span>Baca Selengkapnya</span>
                        <ChevronRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}