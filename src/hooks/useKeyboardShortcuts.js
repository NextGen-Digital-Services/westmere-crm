import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const setCommandPaletteOpen = useAppStore((s) => s.setCommandPaletteOpen);
  const setQuickAddModalOpen = useAppStore((s) => s.setQuickAddModalOpen);
  const gPressedRef = useRef(false);
  const gTimeoutRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input, textarea, or contentEditable
      const target = e.target;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // Cmd+K or Ctrl+K - always available
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // If user is typing in form field, skip single-letter shortcuts
      if (isInput) return;

      // 'N' for New Lead
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setQuickAddModalOpen(true);
        return;
      }

      // '/' for Command Palette / Search
      if (e.key === '/') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // 'G' sequences: G then D (Dashboard), G then P (Pipeline), G then L (Leads), G then T (Targets)
      if (e.key.toLowerCase() === 'g') {
        gPressedRef.current = true;
        if (gTimeoutRef.current) clearTimeout(gTimeoutRef.current);
        gTimeoutRef.current = setTimeout(() => {
          gPressedRef.current = false;
        }, 1200);
        return;
      }

      if (gPressedRef.current) {
        const nextKey = e.key.toLowerCase();
        gPressedRef.current = false;
        if (gTimeoutRef.current) clearTimeout(gTimeoutRef.current);

        if (nextKey === 'd') {
          e.preventDefault();
          navigate('/');
        } else if (nextKey === 'p') {
          e.preventDefault();
          navigate('/pipeline');
        } else if (nextKey === 'l') {
          e.preventDefault();
          navigate('/leads');
        } else if (nextKey === 't') {
          e.preventDefault();
          navigate('/targets');
        } else if (nextKey === 'o') {
          e.preventDefault();
          navigate('/outreach');
        } else if (nextKey === 'm') {
          e.preventDefault();
          navigate('/meetings');
        } else if (nextKey === 's') {
          e.preventDefault();
          navigate('/settings');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gTimeoutRef.current) clearTimeout(gTimeoutRef.current);
    };
  }, [navigate, setCommandPaletteOpen, setQuickAddModalOpen]);
}
