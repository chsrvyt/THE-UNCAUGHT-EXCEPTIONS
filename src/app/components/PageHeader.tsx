import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Props {
  title: string;
  backTo?: string;
}

export function PageHeader({ title, backTo = '/app' }: Props) {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center gap-3 px-4 bg-white border-b border-gray-100"
      style={{ paddingTop: 16, paddingBottom: 16 }}
    >
      <button
        onClick={() => navigate(backTo)}
        className="flex items-center justify-center rounded-full"
        style={{ width: 40, height: 40, background: '#f0fdf4', color: '#14532d', flexShrink: 0 }}
      >
        <ChevronLeft size={22} />
      </button>
      <h2 style={{ color: '#14532d', margin: 0 }}>{title}</h2>
    </div>
  );
}
