import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useGuide } from '../../context/GuideContext';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface GuideProgressProps {
  guideId: string;
  currentSection: string;
  sections: {
    id: string;
    title: string;
    items: string[];
  }[];
  onComplete: () => void;
}

export const GuideProgress: React.FC<GuideProgressProps> = ({
  guideId,
  currentSection,
  sections = [],
  onComplete
}) => {
  const { getGuideProgress, markSectionComplete, getSectionProgress, updateLastVisited } = useGuide();
  const progress = getGuideProgress(guideId);
  
  // Local state to track individual item completion within the current section
  const [itemCompletionState, setItemCompletionState] = useState<Record<string, boolean>>({});

  // Get the current section object
  const currentSectionObj = sections.find(section => section.id === currentSection);

  // Update lastVisited whenever currentSection changes
  useEffect(() => {
    updateLastVisited(guideId, currentSection);
  }, [currentSection, guideId, updateLastVisited]);

  // Initialize local state when currentSection changes
  useEffect(() => {
    if (currentSectionObj) {
      const isSectionComplete = getSectionProgress(guideId, currentSection);
      const initialState: Record<string, boolean> = {};
      
      currentSectionObj.items.forEach(item => {
        // If section is already complete, mark all items as checked
        initialState[item] = isSectionComplete;
      });
      
      setItemCompletionState(initialState);
    }
  }, [currentSection, currentSectionObj, getSectionProgress, guideId]);

  // Handle individual item checkbox change
  const handleItemChange = (item: string, checked: boolean) => {
    const newState = {
      ...itemCompletionState,
      [item]: checked
    };
    setItemCompletionState(newState);
    
    // Check if all items are now completed
    if (currentSectionObj) {
      const allItemsComplete = currentSectionObj.items.every(sectionItem => 
        newState[sectionItem] === true
      );
      
      // If all items are complete, mark the section as complete
      if (allItemsComplete) {
        markSectionComplete(guideId, currentSection);
      }
    }
  };
  const handleComplete = () => {
    // Mark all items in current section as complete in local state
    if (currentSectionObj) {
      const completeState: Record<string, boolean> = {};
      currentSectionObj.items.forEach(item => {
        completeState[item] = true;
      });
      setItemCompletionState(completeState);
    }
    
    // Mark section as complete in global context
    markSectionComplete(guideId, currentSection);
    onComplete();
  };

  return (
    <Card className="sticky top-4 border-support-gray dark:border-dark-support">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-primary-teal mr-2 dark:text-dark-primary" />
            <span className="font-medium text-foreground dark:text-dark-text">Progress</span>
          </div>
          <span className="text-2xl font-bold text-foreground dark:text-dark-text">{progress}%</span>
        </div>
        
        <div className="w-full bg-support-gray h-2 rounded-full mb-6 dark:bg-dark-support">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, #2A6F7F 0%, #3A9CA8 100%)',
              width: `${progress}%` 
            }}
          />
        </div>

        <div className="space-y-6 mb-6">
          {sections?.map((section) => (
            <div key={section.id}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-foreground dark:text-dark-text">{section.title}</h3>
                {getSectionProgress(guideId, section.id) ? (
                  <CheckCircle className="h-4 w-4 text-success-green dark:text-dark-success" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                {section.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{item}</span>
                    <input 
                      type="checkbox"
                      checked={section.id === currentSection ? 
                        (itemCompletionState[item] || false) : 
                        getSectionProgress(guideId, section.id)
                      }
                      onChange={(e) => {
                        if (section.id === currentSection) {
                          handleItemChange(item, e.target.checked);
                        }
                      }}
                      disabled={section.id !== currentSection}
                      className="h-4 w-4 rounded border-support-gray text-primary-teal focus:ring-primary-teal dark:border-dark-support dark:text-dark-primary dark:focus:ring-dark-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button 
          className="w-full bg-primary-teal hover:bg-secondary-teal text-white dark:bg-dark-primary dark:hover:bg-dark-primary/90"
          onClick={handleComplete}
          disabled={getSectionProgress(guideId, currentSection)}
        >
          {getSectionProgress(guideId, currentSection) ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Completed
            </>
          ) : (
            <>
              Complete Section
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};