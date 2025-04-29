
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Container } from '@/components/ui/layout/Container';
import { AppLayout } from '@/components/ui/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Moon, Sun, Monitor } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  return (
    <AppLayout title="App Settings" showFooter={true}>
      <Container className="py-6 space-y-6 animate-fade-in">
        <div className="glass-card p-6 space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Appearance</h2>
            <p className="text-muted-foreground mb-6">
              Customize how the app looks for you
            </p>
            
            <RadioGroup 
              value={theme || 'light'} 
              onValueChange={handleThemeChange}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center">
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center">
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="flex items-center">
                  <Monitor className="mr-2 h-4 w-4" />
                  System
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default Settings;
