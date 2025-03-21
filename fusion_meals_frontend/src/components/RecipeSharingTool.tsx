"use client"

import React, { useState } from 'react'
import { 
  TextField, 
  Button, 
  Grid, 
  CircularProgress,
  Box,
  Card,
  CardContent,
  Alert,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  FormControlLabel,
  Switch,
  Paper,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import TagIcon from '@mui/icons-material/Tag'
import EmailIcon from '@mui/icons-material/Email'
import TwitterIcon from '@mui/icons-material/Twitter'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import axios from 'axios'

interface RecipeSharingToolProps {
  initialRecipe?: string
}

interface SharingResponse {
  original_recipe: string
  sharing_content: {
    main_text: string
    subject_line?: string
    call_to_action: string
    short_version: string
  }
  suggested_image_prompts: string[]
  suggested_tags: string[]
  scheduled_time_suggestions: {
    day: string
    time: string
    rationale: string
  }[]
}

export default function RecipeSharingTool({ initialRecipe = '' }: RecipeSharingToolProps) {
  const [recipeText, setRecipeText] = useState(initialRecipe)
  const [platform, setPlatform] = useState<string>('instagram')
  const [additionalNotes, setAdditionalNotes] = useState<string>('')
  const [includeTags, setIncludeTags] = useState<boolean>(true)
  const [highlightFeature, setHighlightFeature] = useState<string>('')
  const [sharingResult, setSharingResult] = useState<SharingResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  const featureOptions = [
    '', 'healthy', 'quick', 'budget-friendly', 'vegetarian', 'vegan', 
    'gluten-free', 'family-friendly', 'seasonal', 'low-carb'
  ]

  const platformIcons = {
    twitter: <TwitterIcon />,
    instagram: <InstagramIcon />,
    facebook: <FacebookIcon />,
    email: <EmailIcon />
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!recipeText.trim()) {
      setError('Please enter a recipe')
      return
    }
    
    setLoading(true)
    setError(null)
    setSharingResult(null)
    
    try {
      const response = await axios.post('/api/recipe-sharing/generate', {
        recipe_text: recipeText,
        platform,
        additional_notes: additionalNotes.trim() || null,
        include_tags: includeTags,
        highlight_feature: highlightFeature || null
      })
      
      setSharingResult(response.data)
    } catch (err) {
      console.error('Error generating sharing content:', err)
      setError('Failed to generate sharing content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setRecipeText('')
    setPlatform('instagram')
    setAdditionalNotes('')
    setIncludeTags(true)
    setHighlightFeature('')
    setSharingResult(null)
    setError(null)
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <Box>
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 'rgba(0, 0, 0, 0.04) 0px 3px 5px' }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Recipe"
                  fullWidth
                  multiline
                  rows={6}
                  value={recipeText}
                  onChange={(e) => setRecipeText(e.target.value)}
                  placeholder="Paste your recipe here..."
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="platform-label">Sharing Platform</InputLabel>
                  <Select
                    labelId="platform-label"
                    value={platform}
                    label="Sharing Platform"
                    onChange={(e) => setPlatform(e.target.value)}
                    startAdornment={
                      <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                        {platformIcons[platform as keyof typeof platformIcons]}
                      </Box>
                    }
                  >
                    <MenuItem value="instagram">Instagram</MenuItem>
                    <MenuItem value="facebook">Facebook</MenuItem>
                    <MenuItem value="twitter">Twitter</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="highlight-feature-label">Highlight Feature (Optional)</InputLabel>
                  <Select
                    labelId="highlight-feature-label"
                    value={highlightFeature}
                    label="Highlight Feature (Optional)"
                    onChange={(e) => setHighlightFeature(e.target.value)}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="healthy">Healthy</MenuItem>
                    <MenuItem value="quick">Quick & Easy</MenuItem>
                    <MenuItem value="budget-friendly">Budget-Friendly</MenuItem>
                    <MenuItem value="vegetarian">Vegetarian</MenuItem>
                    <MenuItem value="vegan">Vegan</MenuItem>
                    <MenuItem value="gluten-free">Gluten-Free</MenuItem>
                    <MenuItem value="family-friendly">Family-Friendly</MenuItem>
                    <MenuItem value="seasonal">Seasonal</MenuItem>
                    <MenuItem value="low-carb">Low-Carb</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Additional Notes (Optional)"
                  fullWidth
                  multiline
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Add any additional information you want to highlight (e.g., special occasion, personal story)"
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={includeTags} 
                      onChange={(e) => setIncludeTags(e.target.checked)} 
                    />
                  } 
                  label="Include hashtags/tags" 
                />
              </Grid>
              
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button 
                    variant="outlined" 
                    onClick={handleClear}
                    disabled={loading}
                  >
                    Clear
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading || !recipeText.trim()}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? 'Generating...' : 'Generate Sharing Content'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {sharingResult && (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Sharing Content for {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="sharing content tabs"
              variant="fullWidth"
              sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab 
                icon={platformIcons[platform as keyof typeof platformIcons]} 
                label="Content" 
                id="tab-0" 
                aria-controls="tabpanel-0" 
              />
              <Tab 
                icon={<CameraAltIcon />} 
                label="Image Ideas" 
                id="tab-1" 
                aria-controls="tabpanel-1" 
              />
              <Tab 
                icon={<TagIcon />} 
                label="Tags" 
                id="tab-2" 
                aria-controls="tabpanel-2" 
              />
              <Tab 
                icon={<ScheduleIcon />} 
                label="Timing" 
                id="tab-3" 
                aria-controls="tabpanel-3" 
              />
            </Tabs>
            
            <Box
              role="tabpanel"
              hidden={tabValue !== 0}
              id="tabpanel-0"
              aria-labelledby="tab-0"
            >
              {tabValue === 0 && (
                <Box>
                  {platform === 'email' && sharingResult.sharing_content.subject_line && (
                    <Paper 
                      elevation={0} 
                      sx={{ p: 2, mb: 3, background: '#f5f5f5', borderRadius: 2 }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight={600}>Subject Line</Typography>
                        <Tooltip title={copied === 'subject' ? 'Copied!' : 'Copy to clipboard'}>
                          <IconButton 
                            size="small" 
                            onClick={() => copyToClipboard(sharingResult.sharing_content.subject_line || '', 'subject')}
                          >
                            {copied === 'subject' ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {sharingResult.sharing_content.subject_line}
                      </Typography>
                    </Paper>
                  )}
                  
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      mb: 3, 
                      background: platform === 'instagram' ? 'linear-gradient(145deg, #f5f7fa, #ffffff)' : '#f9f9f9',
                      borderRadius: 2,
                      border: platform === 'instagram' ? '1px solid rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600}>Main Content</Typography>
                      <Tooltip title={copied === 'main' ? 'Copied!' : 'Copy to clipboard'}>
                        <IconButton 
                          size="small" 
                          onClick={() => copyToClipboard(sharingResult.sharing_content.main_text, 'main')}
                        >
                          {copied === 'main' ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        whiteSpace: 'pre-line',
                        fontFamily: platform === 'twitter' ? 'sans-serif' : 'inherit',
                      }}
                    >
                      {sharingResult.sharing_content.main_text}
                    </Typography>
                  </Paper>
                  
                  <Paper 
                    elevation={0} 
                    sx={{ p: 2, mb: 3, background: '#f0f0f0', borderRadius: 2 }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight={600}>Short Version</Typography>
                      <Tooltip title={copied === 'short' ? 'Copied!' : 'Copy to clipboard'}>
                        <IconButton 
                          size="small" 
                          onClick={() => copyToClipboard(sharingResult.sharing_content.short_version, 'short')}
                        >
                          {copied === 'short' ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                      {sharingResult.sharing_content.short_version}
                    </Typography>
                  </Paper>
                  
                  <Paper 
                    elevation={0} 
                    sx={{ p: 2, mb: 3, background: '#f0f7ff', borderRadius: 2 }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight={600}>Call to Action</Typography>
                      <Tooltip title={copied === 'cta' ? 'Copied!' : 'Copy to clipboard'}>
                        <IconButton 
                          size="small" 
                          onClick={() => copyToClipboard(sharingResult.sharing_content.call_to_action, 'cta')}
                        >
                          {copied === 'cta' ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Typography variant="body1" sx={{ mt: 1, color: '#0066cc' }}>
                      {sharingResult.sharing_content.call_to_action}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Box>
            
            <Box
              role="tabpanel"
              hidden={tabValue !== 1}
              id="tabpanel-1"
              aria-labelledby="tab-1"
            >
              {tabValue === 1 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Use these detailed prompts to create compelling images for your recipe:
                  </Typography>
                  
                  {sharingResult.suggested_image_prompts.map((prompt, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        background: index % 2 === 0 ? '#f9f9f9' : '#f5f5f5',
                        borderLeft: '4px solid #3f51b5',
                        borderRadius: 1
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" fontWeight={600}>Image Prompt {index + 1}</Typography>
                        <Tooltip title={copied === `prompt-${index}` ? 'Copied!' : 'Copy to clipboard'}>
                          <IconButton 
                            size="small" 
                            onClick={() => copyToClipboard(prompt, `prompt-${index}`)}
                          >
                            {copied === `prompt-${index}` ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {prompt}
                      </Typography>
                    </Paper>
                  ))}
                  
                  <Alert severity="info" sx={{ mt: 2 }}>
                    These prompts can be used with AI image generators or as inspiration for your own food photography.
                  </Alert>
                </Box>
              )}
            </Box>
            
            <Box
              role="tabpanel"
              hidden={tabValue !== 2}
              id="tabpanel-2"
              aria-labelledby="tab-2"
            >
              {tabValue === 2 && (
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Suggested Hashtags & Tags
                    </Typography>
                    <Tooltip title={copied === 'tags' ? 'Copied!' : 'Copy all tags to clipboard'}>
                      <IconButton 
                        size="small" 
                        onClick={() => copyToClipboard(sharingResult.suggested_tags.join(' '), 'tags')}
                      >
                        {copied === 'tags' ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  
                  <Paper 
                    elevation={0} 
                    sx={{ p: 3, background: '#f9f9f9', borderRadius: 2 }}
                  >
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {sharingResult.suggested_tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          variant="outlined" 
                          color="primary" 
                          onClick={() => copyToClipboard(tag, `tag-${index}`)}
                          sx={{ mb: 1, '&:hover': { backgroundColor: 'rgba(63, 81, 181, 0.08)' } }}
                        />
                      ))}
                    </Stack>
                  </Paper>
                  
                  <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    Click on any tag to copy it individually or use the copy button above to copy all tags.
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box
              role="tabpanel"
              hidden={tabValue !== 3}
              id="tabpanel-3"
              aria-labelledby="tab-3"
            >
              {tabValue === 3 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Optimal Times to Share:
                  </Typography>
                  
                  {sharingResult.scheduled_time_suggestions.map((suggestion, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        background: '#f9f9f9',
                        border: '1px solid #eaeaea',
                        borderRadius: 2
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <ScheduleIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {suggestion.day} at {suggestion.time}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ ml: 4 }}>
                        {suggestion.rationale}
                      </Typography>
                    </Paper>
                  ))}
                  
                  <Alert severity="info" sx={{ mt: 2 }}>
                    These times are suggestions based on general engagement patterns. Consider your specific audience's habits for optimal results.
                  </Alert>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
} 