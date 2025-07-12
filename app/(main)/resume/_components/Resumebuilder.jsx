"use client";
import { saveResume } from "@/actions/resume";
import { resumeSchema } from "@/app/lib/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import userFetch from "@/hooks/user-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import EntryForm from "./EntryForm";
import { entriesTOMarkdown } from "@/app/lib/helper";
import MDEditor from "@uiw/react-md-editor";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const Resumebuilder = ({ initialContent }) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [resumeMode, setResumeMode] = useState("preview");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const [isGenerating, setIsGenerating] = useState(false);

  const { user } = useUser();
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });
  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = userFetch(saveResume);

  const formValues = watch();
  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombineContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);
    useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center" style="font-size: 72px !important; font-weight: bold !important; color: #000000 !important; margin-bottom: 1em !important; font-family: Arial, sans-serif !important;">${user.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };
  const getCombineContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesTOMarkdown(experience, "Work Experience"),
      entriesTOMarkdown(education, "Education"),
      entriesTOMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };
  const onSubmit = async () => {
    try {
      await saveResumeFn(previewContent)
    } catch (error) {
      console.error("save error",error)
    }
  };
  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      if (typeof window === "undefined") {
        console.warn("PDF generation can only run in the browser.");
        return;
      }

      let element = document.getElementById("resume");
    

      if (!element) {
        console.log("Resume element not found, creating content directly...");
        console.log("Preview content:", previewContent);
        
        // Convert markdown to HTML properly
        const convertMarkdownToHTML = (markdown) => {
          if (!markdown) return 'No content available';
          
          console.log("Original markdown:", markdown);
          
          let html = markdown
            // Convert headers - fix the regex to properly match headers with explicit font sizes
            .replace(/^### (.*$)/gim, '<h3 style="color: #000000 !important; margin-top: 1.5em !important; margin-bottom: 0.5em !important; font-weight: bold !important; font-size: 32px !important; font-family: Arial, sans-serif !important;">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 style="color: #000000 !important; margin-top: 1.5em !important; margin-bottom: 0.5em !important; font-weight: bold !important; font-size: 48px !important; font-family: Arial, sans-serif !important;">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 style="color: #000000 !important; margin-top: 1.5em !important; margin-bottom: 0.5em !important; font-weight: bold !important; font-size: 54px !important; font-family: Arial, sans-serif !important;">$1</h1>')
            // Convert bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold !important;">$1</strong>')
            // Convert italic text
            .replace(/\*(.*?)\*/g, '<em style="font-style: italic !important;">$1</em>')
            // Convert links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #0066cc !important; text-decoration: underline !important;">$1</a>')
            // Special handling for user name div - convert to large heading
            .replace(/<div align="center" style="font-size: 72px !important; font-weight: bold !important; color: #000000 !important; margin-bottom: 1em !important; font-family: Arial, sans-serif !important;">(.*?)<\/div>/g, '<h1 style="color: #000000 !important; margin-top: 0 !important; margin-bottom: 1em !important; font-weight: bold !important; font-size: 72px !important; font-family: Arial, sans-serif !important; text-align: center !important;">$1</h1>');
          
          console.log("After header conversion:", html);
          
          // Handle line breaks and paragraphs properly
          html = html
            .split('\n\n')
            .map(paragraph => {
              if (paragraph.trim() === '') return '';
              // If it's already a header, don't wrap in paragraph
              if (paragraph.trim().startsWith('<h')) {
                return paragraph;
              }
              return `<p style="margin: 0.5em 0 !important; color: #000000 !important; font-size: 16px !important; line-height: 1.4 !important; font-family: Arial, sans-serif !important;">${paragraph.replace(/\n/g, '<br>')}</p>`;
            })
            .filter(p => p !== '')
            .join('');
          
          console.log("Final converted HTML:", html);
          return html;
        };
        
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.4; color: #000000; background-color: #ffffff; padding: 20mm;">
            ${convertMarkdownToHTML(previewContent)}
          </div>
        `;
        
        console.log("Converted HTML content:", htmlContent);
        
        // Create a temporary element with the content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        element = tempDiv;
        console.log("Created temporary element for PDF generation");
      } else {
        console.log("Resume element found, proceeding with oklch patching...");
      }

      // ✅ Enhanced Patch: Convert all unsupported oklch() colors to hex fallbacks
      const convertOklchToHex = (oklchValue) => {
        // Simple conversion based on oklch values
        if (oklchValue.includes("oklch(1 0 0")) return "#ffffff"; // white
        if (oklchValue.includes("oklch(0.145 0 0")) return "#000000"; // black
        if (oklchValue.includes("oklch(0.985 0 0")) return "#fafafa"; // very light gray
        if (oklchValue.includes("oklch(0.97 0 0")) return "#f5f5f5"; // light gray
        if (oklchValue.includes("oklch(0.922 0 0")) return "#e5e5e5"; // gray
        if (oklchValue.includes("oklch(0.708 0 0")) return "#b3b3b3"; // medium gray
        if (oklchValue.includes("oklch(0.556 0 0")) return "#8a8a8a"; // darker gray
        if (oklchValue.includes("oklch(0.205 0 0")) return "#333333"; // dark gray
        if (oklchValue.includes("oklch(0.269 0 0")) return "#444444"; // dark gray
        if (oklchValue.includes("oklch(0.577 0.245 27.325")) return "#dc2626"; // red
        if (oklchValue.includes("oklch(0.704 0.191 22.216")) return "#dc2626"; // red
        if (oklchValue.includes("oklch(0.646 0.222 41.116")) return "#ea580c"; // orange
        if (oklchValue.includes("oklch(0.6 0.118 184.704")) return "#0891b2"; // cyan
        if (oklchValue.includes("oklch(0.398 0.07 227.392")) return "#1d4ed8"; // blue
        if (oklchValue.includes("oklch(0.828 0.189 84.429")) return "#fbbf24"; // yellow
        if (oklchValue.includes("oklch(0.769 0.188 70.08")) return "#f59e0b"; // amber
        if (oklchValue.includes("oklch(0.488 0.243 264.376")) return "#7c3aed"; // violet
        if (oklchValue.includes("oklch(0.696 0.17 162.48")) return "#10b981"; // emerald
        if (oklchValue.includes("oklch(0.627 0.265 303.9")) return "#ec4899"; // pink
        if (oklchValue.includes("oklch(0.645 0.246 16.439")) return "#ef4444"; // red
        return "#000000"; // default fallback
      };

      // Apply comprehensive style overrides to ensure no oklch colors remain
      const applySafeStyles = (el) => {
        try {
          // Skip SVG elements and their children as they have read-only properties
          if (el.tagName === 'SVG' || el.tagName === 'svg' || 
              el.tagName === 'PATH' || el.tagName === 'path' ||
              el.tagName === 'CIRCLE' || el.tagName === 'circle' ||
              el.tagName === 'RECT' || el.tagName === 'rect' ||
              el.tagName === 'LINE' || el.tagName === 'line' ||
              el.tagName === 'POLYGON' || el.tagName === 'polygon' ||
              el.tagName === 'ELLIPSE' || el.tagName === 'ellipse' ||
              el.tagName === 'G' || el.tagName === 'g' ||
              el.namespaceURI === 'http://www.w3.org/2000/svg') {
            return;
          }
          
          // Force safe colors for all elements
          el.style.setProperty('background-color', '#ffffff', 'important');
          el.style.setProperty('color', '#000000', 'important');
          el.style.setProperty('border-color', '#e5e5e5', 'important');
          el.style.setProperty('outline-color', '#000000', 'important');
          
          // Override any CSS custom properties that might contain oklch
          const safeColors = {
            '--background': '#ffffff',
            '--foreground': '#000000',
            '--card': '#ffffff',
            '--card-foreground': '#000000',
            '--popover': '#ffffff',
            '--popover-foreground': '#000000',
            '--primary': '#000000',
            '--primary-foreground': '#ffffff',
            '--secondary': '#f5f5f5',
            '--secondary-foreground': '#000000',
            '--muted': '#f5f5f5',
            '--muted-foreground': '#666666',
            '--accent': '#f5f5f5',
            '--accent-foreground': '#000000',
            '--destructive': '#dc2626',
            '--border': '#e5e5e5',
            '--input': '#e5e5e5',
            '--ring': '#000000'
          };

          Object.entries(safeColors).forEach(([property, value]) => {
            el.style.setProperty(property, value, 'important');
          });
        } catch (error) {
          console.log("Error applying safe styles to element:", error.message);
        }
      };

      // Only apply oklch patching if we have a real DOM element (not our temp div)
      if (element.id === 'resume') {
        console.log("Applying oklch color patching to resume element...");
        
        // Get all computed styles and replace oklch colors
      element.querySelectorAll("*").forEach((el) => {
          try {
            // Skip SVG elements and their children as they have read-only properties
            if (el.tagName === 'SVG' || el.tagName === 'svg' || 
                el.tagName === 'PATH' || el.tagName === 'path' ||
                el.tagName === 'CIRCLE' || el.tagName === 'circle' ||
                el.tagName === 'RECT' || el.tagName === 'rect' ||
                el.tagName === 'LINE' || el.tagName === 'line' ||
                el.tagName === 'POLYGON' || el.tagName === 'polygon' ||
                el.tagName === 'ELLIPSE' || el.tagName === 'ellipse' ||
                el.tagName === 'G' || el.tagName === 'g' ||
                el.namespaceURI === 'http://www.w3.org/2000/svg') {
              return;
            }
            
        const style = getComputedStyle(el);
            const allProperties = [
              'backgroundColor', 'color', 'borderColor', 'borderTopColor', 
              'borderRightColor', 'borderBottomColor', 'borderLeftColor',
              'outlineColor', 'textDecorationColor', 'fill', 'stroke'
            ];

            allProperties.forEach(prop => {
              const value = style[prop];
              if (value && value.includes("oklch")) {
                const hexColor = convertOklchToHex(value);
                el.style[prop] = hexColor;
              }
            });

            // Also handle CSS custom properties that might be used
            const cssVars = [
              '--background', '--foreground', '--card', '--card-foreground',
              '--popover', '--popover-foreground', '--primary', '--primary-foreground',
              '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
              '--accent', '--accent-foreground', '--destructive', '--border',
              '--input', '--ring'
            ];

            cssVars.forEach(varName => {
              const value = style.getPropertyValue(varName);
              if (value && value.includes("oklch")) {
                const hexColor = convertOklchToHex(value);
                el.style.setProperty(varName, hexColor);
              }
            });

            // Apply comprehensive safe styles as a final measure
            applySafeStyles(el);
          } catch (error) {
            console.log("Skipping element due to error:", error.message);
          }
        });

        // Also apply safe styles to the root element
        applySafeStyles(element);
      }

      // Create a temporary clone to ensure complete isolation from page styles
      const clonedElement = element.cloneNode(true);
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      clonedElement.style.width = '210mm'; // A4 width
      clonedElement.style.minHeight = '297mm'; // A4 height
      clonedElement.style.padding = '20mm';
      clonedElement.style.margin = '0';
      clonedElement.style.backgroundColor = '#ffffff';
      clonedElement.style.color = '#000000';
      clonedElement.style.fontFamily = 'Arial, sans-serif';
      clonedElement.style.fontSize = '12pt';
      clonedElement.style.lineHeight = '1.4';
      
      // Apply safe styles to the cloned element as well
      clonedElement.querySelectorAll("*").forEach((el) => {
        try {
          // Skip SVG elements and their children as they have read-only properties
          if (el.tagName === 'SVG' || el.tagName === 'svg' || 
              el.tagName === 'PATH' || el.tagName === 'path' ||
              el.tagName === 'CIRCLE' || el.tagName === 'circle' ||
              el.tagName === 'RECT' || el.tagName === 'rect' ||
              el.tagName === 'LINE' || el.tagName === 'line' ||
              el.tagName === 'POLYGON' || el.tagName === 'polygon' ||
              el.tagName === 'ELLIPSE' || el.tagName === 'ellipse' ||
              el.tagName === 'G' || el.tagName === 'g' ||
              el.namespaceURI === 'http://www.w3.org/2000/svg') {
            return;
          }
          
          applySafeStyles(el);
        } catch (error) {
          console.log("Skipping element due to error:", error.message);
        }
      });
      
      // Add the cloned element to the document temporarily
      document.body.appendChild(clonedElement);

      // Brute-force remove any oklch(...) color functions from inline styles or attributes
      clonedElement.innerHTML = clonedElement.innerHTML.replace(/oklch\([^)]*\)/g, '#000');
      
      // Additional aggressive cleanup - remove all CSS classes and inline styles that might contain oklch
      clonedElement.querySelectorAll("*").forEach((el) => {
        try {
          // Skip SVG elements and their children as they have read-only properties
          if (el.tagName === 'SVG' || el.tagName === 'svg' || 
              el.tagName === 'PATH' || el.tagName === 'path' ||
              el.tagName === 'CIRCLE' || el.tagName === 'circle' ||
              el.tagName === 'RECT' || el.tagName === 'rect' ||
              el.tagName === 'LINE' || el.tagName === 'line' ||
              el.tagName === 'POLYGON' || el.tagName === 'polygon' ||
              el.tagName === 'ELLIPSE' || el.tagName === 'ellipse' ||
              el.tagName === 'G' || el.tagName === 'g' ||
              el.namespaceURI === 'http://www.w3.org/2000/svg') {
            return;
          }
          
          // Remove all CSS classes
          el.className = '';
          // Remove all data attributes that might contain styling
          Array.from(el.attributes).forEach(attr => {
            if (attr.name.startsWith('data-') || attr.name.startsWith('class')) {
              el.removeAttribute(attr.name);
            }
          });
          // Force basic styling
          el.style.cssText = 
            'background-color: #ffffff !important; ' +
            'color: #000000 !important; ' +
            'border-color: #e5e5e5 !important; ' +
            'font-family: Arial, sans-serif !important; ' +
            'font-size: 12pt !important; ' +
            'line-height: 1.4 !important;';
        } catch (error) {
          console.log("Skipping element due to error:", error.message);
        }
      });

      console.log("Finished applying all oklch patches, generating PDF...");

      // Alternative approach: Create completely clean HTML without any CSS dependencies
      const createCleanHTML = () => {
        const cleanHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body {
                font-family: Arial, sans-serif;
                font-size: 12pt;
                line-height: 1.4;
                color: #000000;
                background-color: #ffffff;
                margin: 0;
                padding: 20mm;
              }
              h1 {
                color: #000000 !important;
                margin-top: 1.5em !important;
                margin-bottom: 0.5em !important;
                font-weight: bold !important;
                font-size: 72px !important;
                font-family: Arial, sans-serif !important;
                text-align: center !important;
              }
              h2 {
                color: #000000 !important;
                margin-top: 1.5em !important;
                margin-bottom: 0.5em !important;
                font-weight: bold !important;
                font-size: 48px !important;
                font-family: Arial, sans-serif !important;
              }
              h3 {
                color: #000000 !important;
                margin-top: 1.5em !important;
                margin-bottom: 0.5em !important;
                font-weight: bold !important;
                font-size: 32px !important;
                font-family: Arial, sans-serif !important;
              }
              h4, h5, h6 {
                color: #000000 !important;
                margin-top: 1em !important;
                margin-bottom: 0.5em !important;
                font-weight: bold !important;
                font-size: 28px !important;
                font-family: Arial, sans-serif !important;
              }
              p {
                margin: 0.5em 0 !important;
                color: #000000 !important;
                font-size: 16px !important;
                line-height: 1.4 !important;
                font-family: Arial, sans-serif !important;
              }
              strong {
                font-weight: bold;
              }
              em {
                font-style: italic;
              }
              a {
                color: #0066cc;
                text-decoration: underline;
              }
              * {
                background-color: #ffffff !important;
                color: #000000 !important;
                border-color: #e5e5e5 !important;
              }
            </style>
          </head>
          <body>
            ${clonedElement.innerHTML}
          </body>
          </html>
        `;
        return cleanHTML;
      };

      const html2pdf = (await import("html2pdf.js")).default;

      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      try {
        // Always use the clean HTML approach to ensure our font sizes are applied
        const cleanHTML = createCleanHTML();
        console.log("Attempting PDF generation with clean HTML...");
        console.log("Clean HTML content:", cleanHTML);
        await html2pdf().set(opt).from(cleanHTML).save();
        console.log("PDF generated successfully!");
      } catch (error) {
        console.error("PDF generation failed:", error);
        throw error;
      } finally {
        // Clean up the temporary element
        document.body.removeChild(clonedElement);
      }
    } catch (error) {
      console.error("PDF generation error", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        <div className="space-x-2">
          <Button variant="destructive" onClick={onSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
            <Save className="h-4 w-4" />
            Save
              </>
            )}
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <form className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bordder rounded-lg bg-muted/50">
                {/* EMail */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="your@email.com"
                    error={errors.contactInfo?.email}
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>
                {/* Mobile */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+1 234 567 8900"
                    error={errors.contactInfo?.email}
                  />
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                {/* Linkedin */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Linkedin</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type="email"
                    placeholder="https://linkedin.com/in/your-profile"
                    error={errors.contactInfo?.linkedin}
                  />
                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>
                {/* Twitter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Twitter / X Profile
                  </label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="email"
                    placeholder="https://twitter.com/your-profile"
                    error={errors.contactInfo?.twitter}
                  />
                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary..."
                    error={errors.summary}
                  />
                )}
              />
              {errors.summary && (
                <p className="text-sm text-red-500">{errors.summary.message}</p>
              )}
            </div>
            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your key skills..."
                    error={errors.skills}
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>
            {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Experience"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>
            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.education && (
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>
            {/* Projects */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Project"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.projects && (
                <p className="text-sm text-red-500">
                  {errors.projects.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>
        <TabsContent value="preview">
          {activeTab === "preview" && (
            <Button
              variant="link"
              type="button"
              className="mb-2"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Resume
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" />
                  Show Preview
                </>
              )}
            </Button>
          )}

          {activeTab === "preview" && resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose editied markdown if you update the form data.
              </span>
            </div>
          )}
          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>
          <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', visibility: 'hidden' }}>
            <div id="resume">
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "black",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resumebuilder;
