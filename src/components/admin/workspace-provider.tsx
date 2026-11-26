'use client';

import {createContext, useContext, useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {readWorkspace, writeWorkspace} from '@/lib/admin/storage';
import {seedWorkspace} from '@/lib/admin/seed';
import type {
  ContentRecord,
  PageSettings,
  SectionKey,
  Workspace,
} from '@/lib/admin/types';

interface WorkspaceContextValue {
  workspace: Workspace;
  ready: boolean;
  saving: boolean;
  notice: string;
  error: string;
  saveRecord: (record: ContentRecord) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  savePage: (section: SectionKey, settings: PageSettings) => Promise<void>;
  clearNotice: () => void;
}
const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({children}: {children: React.ReactNode}) {
  const t = useTranslations('admin.cms');
  const [workspace, setWorkspace] = useState(seedWorkspace);
  const current = useRef(workspace);
  const busy = useRef(false);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    readWorkspace()
      .then((stored) => {
        if (!active) return;
        if (
          stored?.version === 1 &&
          Array.isArray(stored.records) &&
          stored.pages
        ) {
          current.current = stored;
          setWorkspace(stored);
        }
        setReady(true);
      })
      .catch(() => {
        if (active) {
          setError(t('storageReadError'));
          setReady(true);
        }
      });
    return () => {
      active = false;
    };
  }, [t]);

  async function commit(
    update: (data: Workspace) => Workspace,
    message: string,
  ) {
    if (busy.current || !ready) throw new Error(t('busy'));
    busy.current = true;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const next = update(current.current);
      await writeWorkspace(next);
      current.current = next;
      setWorkspace(next);
      setNotice(message);
    } catch (cause) {
      setError(t('storageWriteError'));
      throw cause;
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }
  const value: WorkspaceContextValue = {
    workspace,
    ready,
    saving,
    notice,
    error,
    clearNotice: () => setNotice(''),
    saveRecord: (record) =>
      commit(
        (data) => ({
          ...data,
          records: [
            ...data.records.filter((item) => item.id !== record.id),
            {...record, updatedAt: new Date().toISOString()},
          ],
        }),
        t('saved'),
      ),
    deleteRecord: (id) =>
      commit(
        (data) => ({
          ...data,
          records: data.records.filter((item) => item.id !== id),
        }),
        t('deleted'),
      ),
    savePage: (section, settings) =>
      commit(
        (data) => ({...data, pages: {...data.pages, [section]: settings}}),
        t('saved'),
      ),
  };
  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('WorkspaceProvider is required.');
  return context;
}
