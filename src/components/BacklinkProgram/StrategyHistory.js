import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  IconButton,
} from '@mui/material';
import { History, OpenInNew } from '@mui/icons-material';

function StrategyHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Strategy History
          </Typography>
          <Typography color="text.secondary">
            No previous strategies found. Generate your first backlink strategy to see it here.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Strategy History
        </Typography>
        <List>
          {history.map((strategy, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end">
                  <OpenInNew />
                </IconButton>
              }
            >
              <ListItemIcon>
                <History />
              </ListItemIcon>
              <ListItemText
                primary={strategy.website_url}
                secondary={
                  <Box>
                    <Typography variant="body2" component="span">
                      {strategy.industry} • {strategy.business_type}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={strategy.timeframe}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`${strategy.goals.length} goals`}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default StrategyHistory;