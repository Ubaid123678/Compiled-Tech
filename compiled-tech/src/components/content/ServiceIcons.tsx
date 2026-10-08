import {
  Layout,
  Layers,
  Store,
  Brain,
  Bot,
  FileText,
  Zap,
  Settings,
  BookOpen,
  Wrench,
} from "lucide-react";

export const serviceIcons: Record<string, React.ReactNode> = {
  "Web & Mobile App Development": <Layout className="w-6 h-6" aria-hidden="true" />,
  "SaaS & Custom Software Development": <Layers className="w-6 h-6" aria-hidden="true" />,
  "E-commerce Development": <Store className="w-6 h-6" aria-hidden="true" />,
  "Custom AI & Machine Learning": <Brain className="w-6 h-6" aria-hidden="true" />,
  "AI Chatbots & Virtual Assistants": <Bot className="w-6 h-6" aria-hidden="true" />,
  "AI Data & Document Processing": <FileText className="w-6 h-6" aria-hidden="true" />,
  "AI Automation & AI Agents": <Zap className="w-6 h-6" aria-hidden="true" />,
  "AI Consulting": <Settings className="w-6 h-6" aria-hidden="true" />,
  "Training Workshops": <BookOpen className="w-6 h-6" aria-hidden="true" />,
  "Maintenance and Support": <Wrench className="w-6 h-6" aria-hidden="true" />,
};

export function getServiceIcon(name: string) {
  return serviceIcons[name] || <Layout className="w-6 h-6" aria-hidden="true" />;
}