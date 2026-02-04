'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { COMMON_PROGRAMS } from '../constants/common-programs';
import { useProgramAuthority, useProgramIdl, useProgramMetadata } from '../hooks/use-program-info';
import { IdlViewer } from './idl-viewer';
import { ProgramMetadata } from './program-metadata';

export function ProgramInfoDemo({ defaultProgramId }: ProgramInfoDemoProps) {
  const [activeTab, setActiveTab] = useState<ProgramInfoUseCase>('metadata');
  const [programId, setProgramId] = useState(defaultProgramId || COMMON_PROGRAMS[0].id);
  const [submitted, setSubmitted] = useState(true);

  // Hooks for each use case
  const metadata = useProgramMetadata(programId, submitted && activeTab === 'metadata');
  const authority = useProgramAuthority(programId, submitted && activeTab === 'upgrade-authority');
  const idl = useProgramIdl(programId, submitted && activeTab === 'idl');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleTabChange = (tab: ProgramInfoUseCase) => {
    setActiveTab(tab);
    setSubmitted(true);
  };

  const handleProgramSelect = (id: string) => {
    setProgramId(id);
    setSubmitted(true);
  };

  const tabs: { id: ProgramInfoUseCase; label: string }[] = [
    { id: 'metadata', label: 'Program Metadata' },
    { id: 'upgrade-authority', label: 'Upgrade Authority' },
    { id: 'idl', label: 'IDL Lookup' },
  ];

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 rounded-none whitespace-nowrap',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-transparent'
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="programId" className="text-sm font-medium">
            Program ID
          </label>
          <input
            id="programId"
            type="text"
            value={programId}
            onChange={(e) => {
              setProgramId(e.target.value);
              setSubmitted(false);
            }}
            placeholder="Enter program ID..."
            className={cn(
              'w-full px-3 py-2 rounded-lg font-mono text-sm',
              'border bg-background',
              'focus:outline-none focus:ring-2 focus:ring-primary'
            )}
          />
        </div>

        {/* Quick select common programs (PROG-03) */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Quick select:</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_PROGRAMS.slice(0, 4).map((prog) => (
              <Button
                key={prog.id}
                type="button"
                variant={programId === prog.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleProgramSelect(prog.id)}
                className="px-3 py-1 text-xs rounded-full h-auto"
              >
                {prog.name}
              </Button>
            ))}
          </div>
        </div>

        <Button type="submit" variant="solana">
          Look Up Program
        </Button>
      </form>

      {/* Results */}
      <div className="p-4 md:p-6 border rounded-lg bg-card">
        {activeTab === 'metadata' && (
          <ProgramMetadata
            data={metadata.data as ProgramInfo | undefined}
            isLoading={metadata.isLoading}
            error={metadata.error}
          />
        )}

        {activeTab === 'upgrade-authority' && (
          <ProgramMetadata
            data={authority.data as ProgramInfo | undefined}
            isLoading={authority.isLoading}
            error={authority.error}
          />
        )}

        {activeTab === 'idl' && (
          <IdlViewer
            data={idl.data as IdlResult | undefined}
            isLoading={idl.isLoading}
            error={idl.error}
          />
        )}
      </div>
    </div>
  );
}
