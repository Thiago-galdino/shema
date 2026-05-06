'use client';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getInitials, timeAgo, getAvatarUrl } from '@/lib/utils';
import styles from './feed.module.css';

function PostCard({ post, onLike, onComment, currentUser }) {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const liked = post.likes?.some(l => l === currentUser?._id || l?._id === currentUser?._id);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    await onComment(post._id, commentText);
    setCommentText('');
    setSubmitting(false);
    setShowComments(true);
  };

  return (
    <div className={`card ${styles.postCard} ${post.isPinned ? styles.pinned : ''}`}>
      {post.isPinned && <div className={styles.pinnedBadge}>📌 Fixado</div>}
      <div className={styles.postHeader}>
        <div className="avatar avatar-md" style={{ background: 'var(--primary)', color: 'var(--accent)' }}>
          {post.author?.avatar ? <Image src={getAvatarUrl(post.author.avatar)} alt={post.author?.name || 'Avatar'} width={48} height={48} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(post.author?.name)}
        </div>
        <div className={styles.postAuthor}>
          <div className={styles.authorName}>{post.author?.name}</div>
          <div className={styles.postTime}>{timeAgo(post.createdAt)}</div>
        </div>
        {post.author?.role === 'admin' && <span className="badge badge-admin">Admin</span>}
      </div>

      <p className={styles.postContent}>{post.content}</p>

      {post.mediaUrl && (
        post.mediaType === 'video'
          ? <video src={getAvatarUrl(post.mediaUrl)} controls className={styles.postMedia} />
          : <Image src={getAvatarUrl(post.mediaUrl)} alt="Post" width={700} height={394} unoptimized className={styles.postMedia} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
      )}

      <div className={styles.postActions}>
        <button className={`${styles.actionBtn} ${liked ? styles.liked : ''}`} onClick={() => onLike(post._id)}>
          {liked ? '❤️' : '🤍'} {post.likes?.length || 0}
        </button>
        <button className={styles.actionBtn} onClick={() => setShowComments(p => !p)}>
          💬 {post.comments?.length || 0}
        </button>
      </div>

      {showComments && (
        <div className={styles.commentsSection}>
          {(post.comments || []).map((c, i) => (
            <div key={i} className={styles.comment}>
              <div className="avatar avatar-sm" style={{ background: 'var(--primary)', color: 'var(--accent)', fontSize: '0.6rem' }}>{getInitials(c.author?.name)}</div>
              <div className={styles.commentBody}>
                <span className={styles.commentAuthor}>{c.author?.name}</span>
                <span className={styles.commentText}>{c.text}</span>
              </div>
            </div>
          ))}
          <form onSubmit={submitComment} className={styles.commentForm}>
            <input className="form-input" placeholder="Escreva um comentário..." value={commentText} onChange={e => setCommentText(e.target.value)} />
            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>→</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [posting, setPosting] = useState(false);

  const fetchPosts = useCallback(async () => {
    try { const d = await api.get('/posts?limit=20'); setPosts(d.posts || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const loadPosts = async () => { await fetchPosts(); };
    loadPosts();
  }, [fetchPosts]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim() && !media) return;
    setPosting(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (media) formData.append('media', media);
      await api.post('/posts', formData);
      setContent(''); setMedia(null); setMediaPreview(null);
      await fetchPosts();
    }
    catch (e) { alert(e.message); }
    finally { setPosting(false); }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`, {});
      await fetchPosts();
    } catch (e) { console.error(e); }
  };

  const handleComment = async (postId, text) => {
    try {
      await api.post(`/posts/${postId}/comments`, { text });
      await fetchPosts();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Feed da Comunidade</h1>
          <p className="page-subtitle">Comunicados e momentos da Igreja Shema</p>
        </div>
      </div>

      <div className={styles.feedLayout}>
        <div className={styles.feedMain}>
          <div className={`card ${styles.createPost}`}>
            <div className="avatar avatar-md" style={{ background: 'var(--primary)', color: 'var(--accent)' }}>{getInitials(user?.name)}</div>
            <form onSubmit={handlePost} className={styles.createForm}>
              <textarea className="form-textarea" placeholder="Compartilhe algo com a comunidade..." value={content} onChange={e => setContent(e.target.value)} rows={3} style={{ minHeight: 80 }} />
              
              {mediaPreview && (
                <div className={styles.previewContainer}>
                  {media.type.startsWith('video') ? <video src={mediaPreview} controls /> : <Image src={mediaPreview} alt="Preview" width={700} height={394} unoptimized style={{ width: '100%', height: 'auto' }} />}
                  <button type="button" className={styles.removeMedia} onClick={() => { setMedia(null); setMediaPreview(null); }}>✕</button>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className={styles.mediaLabel}>
                  <input type="file" hidden accept="image/*,video/*" onChange={e => {
                    const file = e.target.files[0];
                    if (file) { setMedia(file); setMediaPreview(URL.createObjectURL(file)); }
                  }} />
                  <span>🖼️ Foto / Vídeo</span>
                </label>
                <button type="submit" className="btn btn-primary" disabled={posting || (!content.trim() && !media)}>
                  {posting ? <><div className="spinner" /> Publicando...</> : '✦ Publicar'}
                </button>
              </div>
            </form>
          </div>

          {loading ? (
            [1,2,3].map(i => <div key={i} className="card skeleton" style={{ height: 200, marginBottom: '1rem' }} />)
          ) : posts.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">💬</div><h3>Feed vazio</h3><p>Seja o primeiro a publicar algo!</p></div>
          ) : (
            posts.map(p => <PostCard key={p._id} post={p} onLike={handleLike} onComment={handleComment} currentUser={user} />)
          )}
        </div>

        <aside className={styles.feedSidebar}>
          <div className="card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>✦ Igreja Batista Shema</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Este é o espaço de comunicação interna da nossa comunidade. Compartilhe, encoraje e fortaleça a fé de cada irmão e irmã.</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a href="https://www.instagram.com/igrejashema/" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">📸 Instagram</a>
              <a href="https://www.facebook.com/igrejabatistashema" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">👍 Facebook</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
