import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  KeyRound,
  Loader2,
  Mail,
  RefreshCcw,
  ShieldCheck,
} from 'lucide-react';
import {
  requestPasswordReset,
  resendPasswordReset,
  verifyPasswordReset,
  finalizePasswordReset,
} from '../api/auth';

const steps = [
  { key: 'request', title: 'Request code', desc: 'Nhập email seller để nhận mã OTP' },
  { key: 'verify', title: 'Verify code', desc: 'Nhập mã 4 số được gửi tới email' },
  { key: 'finalize', title: 'Set new password', desc: 'Tạo mật khẩu mới và xác nhận' },
  { key: 'done', title: 'Completed', desc: 'Bạn có thể đăng nhập lại' },
];

const ForgotPassword = () => {
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const activeIndex = useMemo(() => steps.findIndex((s) => s.key === step), [step]);

  const clearMessages = () => {
    setError('');
    setInfo('');
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim()) {
      setError('Vui lòng nhập email.');
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setInfo('Đã gửi mã OTP tới email. Kiểm tra hộp thư hoặc spam.');
      setStep('verify');
    } catch (err) {
      setError(err?.message || 'Gửi mã OTP thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    clearMessages();
    const normalized = code.trim();
    if (!/^[0-9]{4}$/.test(normalized)) {
      setError('Mã OTP phải gồm 4 chữ số.');
      return;
    }
    setLoading(true);
    try {
      await verifyPasswordReset(normalized);
      setInfo('Xác thực thành công. Đặt mật khẩu mới.');
      setStep('finalize');
    } catch (err) {
      setError(err?.message || 'Xác thực OTP thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!newPassword || newPassword.length < 6) {
      setError('Mật khẩu mới phải tối thiểu 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Xác nhận mật khẩu không khớp.');
      return;
    }
    setLoading(true);
    try {
      await finalizePasswordReset({ code: code.trim(), new_password: newPassword, confirm_password: confirmPassword });
      setInfo('Đổi mật khẩu thành công. Bạn có thể đăng nhập lại.');
      setStep('done');
    } catch (err) {
      setError(err?.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    clearMessages();
    if (!email.trim()) {
      setError('Nhập email trước khi gửi lại mã.');
      return;
    }
    setLoading(true);
    try {
      await resendPasswordReset(email.trim());
      setInfo('Đã gửi lại mã OTP.');
    } catch (err) {
      setError(err?.message || 'Gửi lại OTP thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (step === 'request') {
      return (
        <form onSubmit={handleRequest} className="space-y-3">
          <label className="text-sm font-semibold text-slate-800">Email seller</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seller@example.com"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-slate-900/15 hover:bg-slate-800 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Gửi mã OTP
          </button>
        </form>
      );
    }

    if (step === 'verify') {
      return (
        <form onSubmit={handleVerify} className="space-y-3">
          <label className="text-sm font-semibold text-slate-800">Mã OTP (4 số)</label>
          <div className="relative">
            <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="1234"
              className="w-full pl-9 pr-3 py-2.5 tracking-[0.5em] rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Đã gửi tới: {email}</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-semibold"
            >
              <RefreshCcw className="w-3 h-3" />
              Gửi lại
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-slate-900/15 hover:bg-slate-800 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Xác thực mã
          </button>
        </form>
      );
    }

    return (
      <form onSubmit={handleFinalize} className="space-y-3">
        <label className="text-sm font-semibold text-slate-800">Mật khẩu mới</label>
        <div className="relative">
          <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Tối thiểu 6 ký tự"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            minLength={6}
            required
          />
        </div>
        <label className="text-sm font-semibold text-slate-800">Xác nhận mật khẩu</label>
        <div className="relative">
          <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            minLength={6}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-slate-900/15 hover:bg-slate-800 disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Đổi mật khẩu
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 via-orange-500 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_1fr] bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-slate-900 via-amber-700 to-orange-600 text-white p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" /> Seller password recovery
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold leading-tight">Quên mật khẩu</h2>
              <p className="text-sm text-white/80 leading-relaxed">
                Nhập email seller, xác minh OTP 4 số và đặt mật khẩu mới. Mã chỉ có hiệu lực trong thời gian ngắn.
              </p>
            </div>
            <div className="space-y-3">
              {steps.map((s, idx) => {
                const isActive = idx === activeIndex;
                const isDone = idx < activeIndex;
                return (
                  <div
                    key={s.key}
                    className={`flex items-start gap-3 rounded-lg px-3 py-2 ${
                      isActive ? 'bg-white/15 border border-white/25' : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      ) : isActive ? (
                        <Clock3 className="w-4 h-4 text-amber-200" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/30" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{s.title}</p>
                      <p className="text-xs text-white/80">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/80">
            <KeyRound className="w-4 h-4" />
            OTP hợp lệ cho tài khoản seller đã đăng ký email này.
          </div>
        </div>

        <div className="p-8 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Khôi phục mật khẩu</p>
              <p className="text-xs text-slate-500">3 bước: Email → OTP → Mật khẩu mới</p>
            </div>
            <Link to="/" className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700">
              <ArrowLeft className="w-3 h-3" />
              Quay lại đăng nhập
            </Link>
          </div>

          {error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>
          ) : null}
          {info ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{info}</div>
          ) : null}

          {step === 'done' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Đổi mật khẩu thành công.
              </div>
              <Link
                to="/"
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-slate-900/15 hover:bg-slate-800"
              >
                Đăng nhập ngay
              </Link>
            </div>
          ) : (
            renderForm()
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
