'use client';

import { FormattedClothingRecommendation } from '@/lib/clothing/clothingEngine';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useState } from 'react';

interface DetailedClothingProps {
  recommendation: FormattedClothingRecommendation | null;
}

export default function DetailedClothingRecommendation({ recommendation }: DetailedClothingProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!recommendation) {
    return (
      <div className="p-4 bg-white/20 backdrop-blur rounded-lg">
        <div className="text-center text-gray-600">
          <div className="animate-pulse">Generowanie rekomendacji...</div>
        </div>
      </div>
    );
  }
  
  const hasLayers = recommendation.layers.base.length > 0 || 
                   recommendation.layers.mid.length > 0 || 
                   recommendation.layers.outer.length > 0;
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-700';
    if (confidence >= 75) return 'text-yellow-700';
    return 'text-red-700';
  };
  
  const getConfidenceText = (confidence: number) => {
    if (confidence >= 90) return 'Bardzo pewna';
    if (confidence >= 75) return 'Pewna';
    return 'Niepewna';
  };

  return (
    <div className="p-4 bg-white/20 backdrop-blur rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-black flex items-center gap-2">
          <Info className="w-4 h-4" />
          Inteligentne rekomendacje
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs text-gray-700 hover:text-black transition-colors"
        >
          {isExpanded ? (
            <>
              Ukryj <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Pokaż szczegóły <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      </div>
      
      {/* Quick summary */}
      <div className="mb-3 p-2 bg-black/5 rounded text-sm">
        <div className="font-medium text-black mb-1">{recommendation.advice}</div>
        <div className={`text-xs ${getConfidenceColor(recommendation.confidence)}`}>
          Rekomendacja: {getConfidenceText(recommendation.confidence)} ({recommendation.confidence}%)
        </div>
      </div>
      
      {/* Detailed breakdown when expanded */}
      {isExpanded && (
        <div className="space-y-3 text-sm">
          {hasLayers && (
            <div className="space-y-2">
              <h4 className="font-semibold text-black border-b border-black/10 pb-1">Warstwy ubrania</h4>
              
              {recommendation.layers.base.length > 0 && (
                <div className="flex">
                  <span className="font-medium text-gray-800 w-20 text-xs">Baza:</span>
                  <span className="text-black">{recommendation.layers.base.join(", ")}</span>
                </div>
              )}
              
              {recommendation.layers.mid.length > 0 && (
                <div className="flex">
                  <span className="font-medium text-gray-800 w-20 text-xs">Środek:</span>
                  <span className="text-black">{recommendation.layers.mid.join(", ")}</span>
                </div>
              )}
              
              {recommendation.layers.outer.length > 0 && (
                <div className="flex">
                  <span className="font-medium text-gray-800 w-20 text-xs">Wierzch:</span>
                  <span className="text-black">{recommendation.layers.outer.join(", ")}</span>
                </div>
              )}
            </div>
          )}
          
          {recommendation.footwear.length > 0 && (
            <div>
              <h4 className="font-semibold text-black border-b border-black/10 pb-1 mb-2">Obuwie</h4>
              <div className="text-black">{recommendation.footwear.join(", ")}</div>
            </div>
          )}
          
          {recommendation.accessories.length > 0 && (
            <div>
              <h4 className="font-semibold text-black border-b border-black/10 pb-1 mb-2">Dodatki</h4>
              <div className="text-black">{recommendation.accessories.join(", ")}</div>
            </div>
          )}
          
          {recommendation.reasoning.length > 0 && (
            <div>
              <h4 className="font-semibold text-black border-b border-black/10 pb-1 mb-2">Powody rekomendacji</h4>
              <div className="space-y-1">
                {recommendation.reasoning.map((reason, index) => (
                  <div key={index} className="text-xs text-gray-700 flex items-start">
                    <span className="w-1 h-1 rounded-full bg-gray-500 mt-2 mr-2 flex-shrink-0"></span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}