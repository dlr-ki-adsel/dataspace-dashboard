import React from 'react';
import { SvgIconProps } from '@mui/material';

// Import all the necessary icons
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TableChartIcon from '@mui/icons-material/TableChart';
import TerminalIcon from '@mui/icons-material/Terminal';
import ArchiveIcon from '@mui/icons-material/Archive';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import ArticleIcon from '@mui/icons-material/Article';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import LanguageIcon from '@mui/icons-material/Language';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import KeyIcon from '@mui/icons-material/Key';
import SettingsIcon from '@mui/icons-material/Settings';
import MailIcon from '@mui/icons-material/Mail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DataArrayIcon from '@mui/icons-material/DataArray';
import SchemaIcon from '@mui/icons-material/Schema';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import DnsIcon from '@mui/icons-material/Dns';


const fileIconMap: Record<string, React.ComponentType<SvgIconProps>> = {
  // Documents
  'pdf': PictureAsPdfIcon,
  'doc': DescriptionIcon,
  'docx': DescriptionIcon,
  'odt': DescriptionIcon,
  'rtf': DescriptionIcon,
  'txt': TextSnippetIcon,
  'md': TextSnippetIcon,
  'markdown': TextSnippetIcon,

  // Spreadsheets
  'xls': TableChartIcon,
  'xlsx': TableChartIcon,
  'csv': TableChartIcon,
  'ods': TableChartIcon,
  'tsv': TableChartIcon,

  // Presentations
  'ppt': SlideshowIcon,
  'pptx': SlideshowIcon,
  'odp': SlideshowIcon,
  'key': SlideshowIcon,

  // Images
  'jpg': ImageIcon,
  'jpeg': ImageIcon,
  'png': ImageIcon,
  'gif': ImageIcon,
  'bmp': ImageIcon,
  'svg': ImageIcon,
  'webp': ImageIcon,
  'tiff': ImageIcon,
  'tif': ImageIcon,
  'ico': ImageIcon,
  'psd': FormatPaintIcon,
  'ai': FormatPaintIcon,
  'eps': FormatPaintIcon,

  // Audio
  'mp3': AudioFileIcon,
  'wav': AudioFileIcon,
  'ogg': AudioFileIcon,
  'flac': AudioFileIcon,
  'aac': AudioFileIcon,
  'm4a': AudioFileIcon,
  'wma': AudioFileIcon,

  // Video
  'mp4': VideoFileIcon,
  'avi': VideoFileIcon,
  'mov': VideoFileIcon,
  'wmv': VideoFileIcon,
  'mkv': VideoFileIcon,
  'flv': VideoFileIcon,
  'webm': VideoFileIcon,
  'mpeg': VideoFileIcon,
  'm4v': VideoFileIcon,

  // Code
  'html': LanguageIcon,
  'htm': LanguageIcon,
  'css': FormatPaintIcon,
  'js': CodeIcon,
  'jsx': CodeIcon,
  'ts': CodeIcon,
  'tsx': CodeIcon,
  'java': CodeIcon,
  'py': CodeIcon,
  'c': CodeIcon,
  'cpp': CodeIcon,
  'cs': CodeIcon,
  'php': CodeIcon,
  'rb': CodeIcon,
  'go': CodeIcon,
  'swift': CodeIcon,
  'kotlin': CodeIcon,
  'rs': CodeIcon, // Rust
  'dart': CodeIcon,
  'scala': CodeIcon,
  'elm': CodeIcon,
  'clj': CodeIcon, // Clojure
  'sql': DataArrayIcon,

  // Data formats
  'json': DataObjectIcon,
  'xml': DataObjectIcon,
  'yaml': DataObjectIcon,
  'yml': DataObjectIcon,
  'toml': DataObjectIcon,
  'ini': SettingsIcon,
  'env': SettingsIcon,
  'properties': SettingsIcon,
  'graphql': SchemaIcon,
  'proto': SchemaIcon,

  // Archives
  'zip': ArchiveIcon,
  'rar': ArchiveIcon,
  'gz': ArchiveIcon,
  'tar': ArchiveIcon,
  '7z': ArchiveIcon,
  'bz2': ArchiveIcon,
  'xz': ArchiveIcon,

  // Configuration and system files
  'sh': TerminalIcon,
  'bash': TerminalIcon,
  'bat': TerminalIcon,
  'ps1': TerminalIcon, // PowerShell
  'gitignore': SettingsIcon,
  'dockerignore': SettingsIcon,
  'dockerfile': DnsIcon,
  'makefile': TerminalIcon,
  'editorconfig': SettingsIcon,
  'eslintrc': SettingsIcon,
  'babelrc': SettingsIcon,
  'npmrc': SettingsIcon,
  'lock': KeyIcon, // package-lock.json, yarn.lock, etc.
  'config': SettingsIcon,

  // Fonts
  'ttf': FontDownloadIcon,
  'otf': FontDownloadIcon,
  'woff': FontDownloadIcon,
  'woff2': FontDownloadIcon,
  'eot': FontDownloadIcon,

  // Ebooks
  'epub': AutoStoriesIcon,
  'mobi': AutoStoriesIcon,
  'azw3': AutoStoriesIcon,
  'fb2': AutoStoriesIcon,

  // Email
  'eml': MailIcon,
  'msg': MailIcon,

  // Calendar
  'ics': CalendarMonthIcon,

  // Other formats
  'log': ArticleIcon,
};


const fileColorMap: Record<string, string> = {
  // Documents
  'pdf': '#f44336', // Red
  'doc': '#2196f3', // Blue
  'docx': '#2196f3',
  'odt': '#2196f3',
  'rtf': '#2196f3',
  'txt': '#673ab7', // Deep Purple
  'md': '#673ab7',
  'markdown': '#673ab7',

  // Spreadsheets
  'xls': '#4caf50', // Green
  'xlsx': '#4caf50',
  'csv': '#4caf50',
  'ods': '#4caf50',
  'tsv': '#4caf50',

  // Presentations
  'ppt': '#ff9800', // Orange
  'pptx': '#ff9800',
  'odp': '#ff9800',
  'key': '#ff9800',

  // Images
  'jpg': '#e91e63', // Pink
  'jpeg': '#e91e63',
  'png': '#e91e63',
  'gif': '#e91e63',
  'bmp': '#e91e63',
  'svg': '#e91e63',
  'webp': '#e91e63',
  'tiff': '#e91e63',
  'tif': '#e91e63',
  'ico': '#e91e63',
  'psd': '#9c27b0', // Purple
  'ai': '#9c27b0',
  'eps': '#9c27b0',

  // Audio
  'mp3': '#00bcd4', // Cyan
  'wav': '#00bcd4',
  'ogg': '#00bcd4',
  'flac': '#00bcd4',
  'aac': '#00bcd4',
  'm4a': '#00bcd4',
  'wma': '#00bcd4',

  // Video
  'mp4': '#673ab7', // Deep Purple
  'avi': '#673ab7',
  'mov': '#673ab7',
  'wmv': '#673ab7',
  'mkv': '#673ab7',
  'flv': '#673ab7',
  'webm': '#673ab7',
  'mpeg': '#673ab7',
  'm4v': '#673ab7',

  // Code
  'html': '#ff5722', // Deep Orange
  'htm': '#ff5722',
  'css': '#3f51b5', // Indigo
  'js': '#607d8b', // Blue Grey
  'jsx': '#607d8b',
  'ts': '#607d8b',
  'tsx': '#607d8b',
  'java': '#607d8b',
  'py': '#607d8b',
  'c': '#607d8b',
  'cpp': '#607d8b',
  'cs': '#607d8b',
  'php': '#607d8b',
  'rb': '#607d8b',
  'go': '#607d8b',
  'swift': '#607d8b',
  'kotlin': '#607d8b',
  'rs': '#607d8b',
  'dart': '#607d8b',
  'scala': '#607d8b',
  'elm': '#607d8b',
  'clj': '#607d8b',
  'sql': '#03a9f4', // Light Blue

  // Data formats
  'json': '#795548', // Brown
  'xml': '#795548',
  'yaml': '#795548',
  'yml': '#795548',
  'toml': '#795548',
  'ini': '#9e9e9e', // Grey
  'env': '#9e9e9e',
  'properties': '#9e9e9e',
  'graphql': '#9c27b0', // Purple
  'proto': '#9c27b0',

  // Archives
  'zip': '#9c27b0', // Purple
  'rar': '#9c27b0',
  'gz': '#9c27b0',
  'tar': '#9c27b0',
  '7z': '#9c27b0',
  'bz2': '#9c27b0',
  'xz': '#9c27b0',

  // Configuration and system files
  'sh': '#009688', // Teal
  'bash': '#009688',
  'bat': '#009688',
  'ps1': '#009688',
  'gitignore': '#9e9e9e', // Grey
  'dockerignore': '#9e9e9e',
  'dockerfile': '#2196f3', // Blue
  'makefile': '#009688', // Teal
  'editorconfig': '#9e9e9e', // Grey
  'eslintrc': '#9e9e9e',
  'babelrc': '#9e9e9e',
  'npmrc': '#9e9e9e',
  'lock': '#ffc107', // Amber
  'config': '#9e9e9e', // Grey

  // Fonts
  'ttf': '#ff5722', // Deep Orange
  'otf': '#ff5722',
  'woff': '#ff5722',
  'woff2': '#ff5722',
  'eot': '#ff5722',

  // Ebooks
  'epub': '#795548', // Brown
  'mobi': '#795548',
  'azw3': '#795548',
  'fb2': '#795548',

  // Email
  'eml': '#2196f3', // Blue
  'msg': '#2196f3',

  // Calendar
  'ics': '#ff9800', // Orange

  // Other formats
  'log': '#757575', // Grey
};

interface FileTypeIconProps {
  fileName: string;
  IconProps?: SvgIconProps;
}


const FileTypeIcon: React.FC<FileTypeIconProps> = ({ fileName, IconProps = {} }) => {
  // Extract file extension (handling special cases like .gitignore, .env, etc.)
  let extension = '';
  
  if (fileName.startsWith('.')) {
    // Files like .gitignore, .env - use the whole name as extension
    extension = fileName.substring(1);
  } else {
    // Regular files with extensions
    const parts = fileName.split('.');
    if (parts.length > 1) {
      extension = parts[parts.length - 1].toLowerCase();
    }
    
    // Handle special cases with compound extensions
    if (extension === 'json' && fileName.endsWith('package.json')) {
      extension = 'config';
    } else if (extension === 'json' && fileName.endsWith('lock.json')) {
      extension = 'lock';
    } else if (['eslintrc', 'babelrc', 'npmrc'].some(ext => fileName.endsWith(`.${ext}.json`))) {
      extension = parts[parts.length - 2].toLowerCase(); // Use the penultimate part
    }
  }
  
  // Get the icon component for this extension
  const IconComponent = extension ? fileIconMap[extension] : null;
  
  // Get the color for this extension
  const color = extension ? fileColorMap[extension] : undefined;
  
  // Create a merged sx prop that includes our color
  const sx = {
    ...(IconProps.sx || {}),
    color: color
  };
  
  // Create a new props object without the color prop (to prevent override)
  const finalProps = { ...IconProps };
  delete finalProps.color; // Remove direct color prop if present
  
  // Add our sx prop with the color
  finalProps.sx = sx;
  
  // Return the icon with our modified props
  return IconComponent ? 
    <IconComponent {...finalProps} /> : 
    <InsertDriveFileIcon {...finalProps} />;
};

export default FileTypeIcon;