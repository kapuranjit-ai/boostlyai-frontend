import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
  Box,
} from '@mui/material';
import {
  Dashboard,
  Search,
  Description,
  Share,
  Analytics,
  Settings,
  Person,
  Article,
  ScaleSharp,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/',
  },
  {
    subheader: 'SEO Tools',
    items: [
      { text: 'SEO Analyzer', icon: <Search />, path: '/seo/analyzer' },
      { text: 'Keyword Research', icon: <Description />, path: '/seo/keywords' },
      { text: 'Meta Tag Generator', icon: <Article />, path: '/seo/meta-tags' },
      { text: 'SEO Reports', icon: <Analytics />, path: '/seo/reports' },
    ],
  },
  {
    subheader: 'Social Media',
    items: [
      { text: 'Content Suggestions', icon: <Share />, path: '/social/content' },
      { text: 'Content Generator', icon: <Share />, path: '/social/content-generator' },
      { text: 'Social Publisher', icon: <Share />, path: '/social/publisher' },
      { text: 'Social Analytics', icon: <Analytics />, path: '/social/analytics' },
      { text: 'Add Copy', icon: <Analytics />, path: '/social/AdCopy' },
      { text: 'Video Content', icon: <Analytics />, path: '/social/VideoContent' },
      { text: 'Video Snippet', icon: <Analytics />, path: '/social/VideoSnippet' },
      { text: 'Video Content Suggestions', icon: <Analytics />, path: '/social/VideoContentSuggestions' },
      { text: 'Generate Your Video', icon: <Analytics />, path: '/social/VideoGenerator' },
    ],
  },
  {
    subheader: 'SEO & Content Expansion',
    items: [
      { text: 'Competitor Analysis', icon: <Share />, path: '/ContentExpansion/Analysis' },
      { text: 'Competitor Result', icon: <Share />, path: '/ContentExpansion/ResultDisplay' },
       { text: 'Backlink Analysis', icon: <Share />, path: '/backlinkAnalysis/Backlink' },
      { text: 'Backlink History', icon: <Share />, path: '/backlinkAnalysis/BackLinkHistory' },
      { text: 'Backlink Programme', icon: <Share />, path: '/BacklinkProgram/BacklinkProgram' },
     
    ],
  },
  {
    subheader: 'Content & Social Boost',
    items: [
      { text: 'Content Calander', icon: <Share />, path: '/ContentSocialBoost/ContentCalender' },
     { text: 'Hashtag Generator', icon: <Share />, path: '/ContentSocialBoost/HashtagGenerator' },
     { text: 'Image Generator', icon: <Share />, path: '/ContentSocialBoost/ImageSuggestions' },
     { text: 'Voice to Blog', icon: <Share />, path: '/ContentSocialBoost/VoiceToBlog' },
     
    ],
  },
  {
    subheader: 'Smart Sales Enablers',
    items: [
      { text: 'SEO Chatbot', icon: <Description />, path: '/SEOChatbot/SEOChatbotWidget' },
      { text: 'Campaign Generator', icon: <Description />, path: '/SEOChatbot/AdCampaignGenerator' },
      { text: 'Campaign Manager', icon: <Description />, path: '/SEOChatbot/AdCampaignManager' },
      { text: 'Media Manager', icon: <Description />, path: '/SEOChatbot/SocialMediaManager' },
   
    ],
  },
  {
    subheader: 'Analytics & Conversion',
    items: [
      { text: 'Performance Dashboar', icon: <Analytics />, path: '/AnalyticsAndConversion/PerformanceDashboard' },
      { text: 'Landing Page Builder', icon: <Analytics />, path: '/AnalyticsAndConversion/LandingPageBuilder' },
   
    ],
  },
  {
    subheader: 'Seo Plan Generator',
    items: [
      { text: 'Dashboar', icon: <Analytics />, path: '/Generator/Dashboard' },
      
   
    ],
  },
  {
    subheader: 'Settings',
    items: [
      { text: 'Profile', icon: <Person />, path: '/profile' },
      { text: 'Projects', icon: <Settings />, path: '/projects' },
      { text: 'Project Dashboard', icon: <Dashboard />, path: '/project-dashboard' },
      { text: 'Project Mapping', icon: <Dashboard />, path: '/project-Mapping' },
    ],
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: 64,
          height: 'calc(100vh - 64px)',
          borderRight: '1px solid #e0e0e0',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', py: 2 }}>
        {menuItems.map((section, index) => (
          <React.Fragment key={index}>
            {section.subheader && (
              <ListSubheader
                component="div"
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.secondary',
                  backgroundColor: 'transparent',
                  lineHeight: '2.5',
                }}
              >
                {section.subheader}
              </ListSubheader>
            )}
            
            <List dense>
              {(section.items || [section]).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItemButton
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    selected={isActive}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      mb: 0.5,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '& .MuiListItemIcon-root': { 
                          color: 'white' 
                        },
                        '&:hover': { 
                          backgroundColor: 'primary.dark' 
                        },
                      },
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: isActive ? 'white' : 'action.active',
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
            
            {section.subheader && index < menuItems.length - 1 && (
              <Divider sx={{ my: 1 }} />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Drawer>
  );
}

export default Sidebar;


// import React from 'react';
// import {
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   ListSubheader,
//   Divider,
//   Box,
// } from '@mui/material';
// import {
//   Dashboard,
//   Search,
//   Description,
//   Share,
//   Analytics,
//   Settings,
// } from '@mui/icons-material';
// import { useNavigate, useLocation } from 'react-router-dom';

// const drawerWidth = 240;

// const menuItems = [
//   {
//     text: 'Dashboard',
//     icon: <Dashboard />,
//     path: '/',
//   },
//   {
//     subheader: 'SEO Tools',
//     items: [
//       { text: 'SEO Analyzer', icon: <Search />, path: '/seo/analyzer' },
//       { text: 'Keyword Research', icon: <Search />, path: '/seo/keywords' },
//       { text: 'Meta Tag Generator', icon: <Description />, path: '/seo/meta-tags' },
//       { text: 'SEO Reports', icon: <Analytics />, path: '/seo/reports' },
//     ],
//   },
//   {
//     subheader: 'Social Media',
//     items: [
//       { text: 'Content Suggestions', icon: <Share />, path: '/social/content' },
//       { text: 'Content Suggestions', icon: <Share />, path: '/social/content' },
//       { text: 'Social Publisher', icon: <Share />, path: '/social/publisher' },
//       { text: 'Social Analytics', icon: <Analytics />, path: '/social/analytics' },
//     ],
//   },
//   {
//     subheader: 'Settings',
//     items: [
//       { text: 'Projects', icon: <Settings />, path: '/settings/projects' },
//       { text: 'ProjectDashboard', icon: <Settings />, path: '/settings/projectDashboard' },
//       { text: 'Accounts', icon: <Settings />, path: '/settings/accounts' },
//     ],
//   },
// ];

// function Sidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         '& .MuiDrawer-paper': {
//           width: drawerWidth,
//           boxSizing: 'border-box',
//           top: 64, // Below header
//           height: 'calc(100vh - 64px)',
//           borderRight: '1px solid #e0e0e0',
//         },
//       }}
//     >
//       <Box sx={{ overflow: 'auto' }}>
//         {menuItems.map((section, index) => (
//           <React.Fragment key={index}>
//             {section.subheader && (
//               <ListSubheader
//                 component="div"
//                 sx={{ fontWeight: 600, color: 'text.secondary' }}
//               >
//                 {section.subheader}
//               </ListSubheader>
//             )}
//             <List>
//               {(section.items || [section]).map((item) => {
//                 const isActive = location.pathname === item.path;
//                 return (
//                   <ListItemButton
//                     key={item.text}
//                     onClick={() => handleNavigation(item.path)}
//                     selected={isActive}
//                     sx={{
//                       borderRadius: 2,
//                       mx: 1,
//                       my: 0.5,
//                       '&.Mui-selected': {
//                         bgcolor: 'primary.main',
//                         color: 'white',
//                         '& .MuiListItemIcon-root': { color: 'white' },
//                         '&:hover': { bgcolor: 'primary.dark' },
//                       },
//                     }}
//                   >
//                     <ListItemIcon>{item.icon}</ListItemIcon>
//                     <ListItemText primary={item.text} />
//                   </ListItemButton>
//                 );
//               })}
//             </List>
//             {section.subheader && <Divider sx={{ my: 1 }} />}
//           </React.Fragment>
//         ))}
//       </Box>
//     </Drawer>
//   );
// }

// export default Sidebar;
