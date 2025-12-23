import React, { useState } from 'react';
import { MessageCircleQuestion, Star, Check, Clock, RefreshCcw, Send, X, Loader2 } from 'lucide-react';
import {
  fetchProductQuestions,
  fetchProductReviews,
  answerProductQuestion,
  createProductQuestion,
  createProductReview,
} from '../api/product';

const QA = () => {
  const [productId, setProductId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [answerModal, setAnswerModal] = useState({ open: false, id: '', content: '' });

  const statusBadge = (status) => {
    const map = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      answered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
    const Icon = status === 'pending' ? Clock : Check;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${map[status] || map.pending}`}>
        <Icon className="w-4 h-4" />
        {status}
      </span>
    );
  };

  const handleLoad = async () => {
    if (!productId.trim()) {
      setError('Nhập Product ID trước khi load.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const [qData, rData] = await Promise.all([fetchProductQuestions(productId), fetchProductReviews(productId)]);
      const listQ = Array.isArray(qData?.items) ? qData.items : Array.isArray(qData) ? qData : [];
      const listR = Array.isArray(rData?.items) ? rData.items : Array.isArray(rData) ? rData : [];
      setQuestions(listQ);
      setReviews(listR);
    } catch (err) {
      setError(err.message || 'Failed to load Q&A.');
      setQuestions([]);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async () => {
    if (!answerModal.id || !answerModal.content.trim()) {
      setError('Nhập nội dung trả lời.');
      return;
    }
    setError('');
    setMessage('');
    try {
      await answerProductQuestion(answerModal.id, { answer: answerModal.content });
      setMessage('Đã trả lời câu hỏi.');
      setAnswerModal({ open: false, id: '', content: '' });
      await handleLoad();
    } catch (err) {
      setError(err.message || 'Failed to answer question.');
    }
  };

  const handleCreateQuestion = async () => {
    if (!productId.trim()) {
      setError('Nhập Product ID trước khi đặt câu hỏi.');
      return;
    }
    if (!newQuestion.trim()) {
      setError('Câu hỏi không được để trống.');
      return;
    }
    setError('');
    setMessage('');
    try {
      await createProductQuestion({ product_id: productId, question: newQuestion });
      setMessage('Question created.');
      setNewQuestion('');
      await handleLoad();
    } catch (err) {
      setError(err.message || 'Failed to create question.');
    }
  };

  const handleCreateReview = async () => {
    if (!productId.trim()) {
      setError('Nhập Product ID trước khi đánh giá.');
      return;
    }
    if (!newReview.comment.trim()) {
      setError('Nội dung đánh giá không được để trống.');
      return;
    }
    setError('');
    setMessage('');
    try {
      await createProductReview({
        product_id: productId,
        rating: Number(newReview.rating) || 0,
        comment: newReview.comment,
      });
      setMessage('Review created.');
      setNewReview({ rating: 5, comment: '' });
      await handleLoad();
    } catch (err) {
      setError(err.message || 'Failed to create review.');
    }
  };

  return (
    <div className="space-y-4 bg-content-bg min-h-screen p-3 lg:p-5">
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-900 text-white grid place-items-center">
            <MessageCircleQuestion className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Q&A / Reviews</p>
            <p className="text-xs text-gray-400">Seller xem, tạo và trả lời câu hỏi sản phẩm</p>
          </div>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Product ID"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            style={{ minWidth: 180 }}
          />
          <button
            className="text-sm font-semibold text-white bg-gray-900 px-3 py-2 rounded-lg disabled:opacity-60"
            onClick={handleLoad}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load'}
          </button>
          <button
            className="text-sm font-semibold text-gray-700 border px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-1"
            onClick={handleLoad}
            disabled={loading}
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{error}</div>}
      {message && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="font-semibold text-gray-900">Product questions</p>
            <span className="text-xs text-gray-500">Manage Q&A</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Ask a question"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              onClick={handleCreateQuestion}
              disabled={loading}
            >
              <Send className="w-4 h-4" />
              Ask
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="border border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-600">Loading questions...</div>
            ) : questions.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-600">No questions yet.</div>
            ) : (
              questions.map((item) => (
                <div key={item.id || item._id || `${item.user}-${item.product}`} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">{item.product_name || item.product || 'Product'}</p>
                    {statusBadge(item.status)}
                  </div>
                  <p className="text-sm text-gray-700 mb-1">"{item.question}"</p>
                  <p className="text-xs text-gray-500">From: {item.user?.name || item.user || 'N/A'} • {item.updated_at || item.updated || ''}</p>
                  {item.answer ? (
                    <div className="mt-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                      <p className="font-semibold text-emerald-800">Answer</p>
                      <p>{item.answer}</p>
                    </div>
                  ) : null}
                  <div className="mt-2 flex gap-2">
                    <button
                      className="text-xs font-semibold text-white bg-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-800 disabled:opacity-60"
                      onClick={() => setAnswerModal({ open: true, id: item.id || item._id, content: '' })}
                      disabled={loading}
                    >
                      Answer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="font-semibold text-gray-900">Product reviews</p>
            <span className="text-xs text-gray-500">Manage reviews</span>
          </div>

          <div className="flex gap-2 items-center">
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview((prev) => ({ ...prev, rating: e.target.value }))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} star{n > 1 ? 's' : ''}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newReview.comment}
              onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
              placeholder="Write a review"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              onClick={handleCreateReview}
              disabled={loading}
            >
              <Send className="w-4 h-4" />
              Post
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="border border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-600">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-600">No reviews yet.</div>
            ) : (
              reviews.map((item) => (
                <div key={item.id || item._id || `${item.user}-${item.product}`} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">{item.product_name || item.product || 'Product'}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-4 h-4 ${idx < (item.rating || 0) ? 'text-yellow-400' : 'text-gray-200'}`}
                          fill={idx < (item.rating || 0) ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{item.comment}</p>
                  <p className="text-xs text-gray-500">From: {item.user?.name || item.user || 'N/A'} • {item.updated_at || item.updated || ''}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {answerModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white border border-gray-200 shadow-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Trả lời câu hỏi</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setAnswerModal({ open: false, id: '', content: '' })}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={answerModal.content}
              onChange={(e) => setAnswerModal((prev) => ({ ...prev, content: e.target.value }))}
              rows={4}
              placeholder="Nhập câu trả lời..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-500"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setAnswerModal({ open: false, id: '', content: '' })}
              >
                Hủy
              </button>
              <button
                className="px-3 py-2 text-sm font-semibold text-white rounded-lg bg-gray-900 hover:bg-gray-800 disabled:opacity-60"
                onClick={handleAnswer}
                disabled={loading}
              >
                Gửi trả lời
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QA;
