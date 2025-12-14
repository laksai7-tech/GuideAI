import React from 'react';
import { Icons } from '../ui/Icons';
import { ModelType, AppConfig } from '../../types';

interface ModelSelectorProps {
  config: AppConfig;
  onConfigChange: (newConfig: Partial<AppConfig>) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ config, onConfigChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectModel = (model: ModelType) => {
    onConfigChange({ model });
    setIsOpen(false);
  };

  const currentModelName = config.model === ModelType.FLASH ? 'Flash 2.5' : 'Pro 3';

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
      >
        {config.model === ModelType.FLASH ? (
          <Icons.Zap className="w-4 h-4 text-amber-500" />
        ) : (
          <Icons.Brain className="w-4 h-4 text-indigo-600" />
        )}
        <span>{currentModelName}</span>
        <Icons.ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 z-20 p-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-xs font-semibold text-slate-500 px-2 py-1 mb-1">Select Model</div>
            
            <button
              onClick={() => selectModel(ModelType.FLASH)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-1 transition-colors ${
                config.model === ModelType.FLASH ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="p-1.5 bg-amber-100 rounded-md">
                <Icons.Zap className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Flash 2.5</span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-full font-medium">Free</span>
                </div>
                <div className="text-xs opacity-70 mt-0.5">Best for speed & daily tasks</div>
              </div>
              {config.model === ModelType.FLASH && <Icons.Check className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={() => selectModel(ModelType.PRO)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                config.model === ModelType.PRO ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="p-1.5 bg-indigo-100 rounded-md">
                <Icons.Brain className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex-1">
                 <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">Pro 3 Preview</span>
                    <span className="text-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-1.5 py-0.5 rounded-full font-medium shadow-sm">Pro</span>
                 </div>
                <div className="text-xs opacity-70 mt-0.5">Complex reasoning & coding</div>
              </div>
              {config.model === ModelType.PRO && <Icons.Check className="w-4 h-4 text-indigo-600" />}
            </button>

            {config.model === ModelType.PRO && (
              <div className="mt-2 pt-2 border-t border-slate-100 px-1">
                <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="flex flex-col">
                     <span className="text-sm font-medium text-slate-700">Deep Thinking</span>
                     <span className="text-xs text-slate-400">Uses more tokens for better logic</span>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={config.enableThinking}
                      onChange={(e) => onConfigChange({ enableThinking: e.target.checked })}
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </div>
                </label>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ModelSelector;