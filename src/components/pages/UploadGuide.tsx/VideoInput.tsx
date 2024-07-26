import { useRef, useState, ChangeEvent } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import DeleteIcon from '@mui/icons-material/Delete';
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded';
import { useTheme, useMediaQuery } from '@mui/material';

type VideoInputProps = {
  fragment: number;
  source?: string;
  onDelete: () => void;
  onFileChange: (url: string) => void;
};

export default function VideoInput({ fragment, source, onDelete, onFileChange }: VideoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localSource, setLocalSource] = useState<string | undefined>(source);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      setLocalSource(url);
      onFileChange(url);
    }
  };

  const handleChoose = () => {
    inputRef.current?.click();
  };

  return (
    <Card
      sx={{
        maxWidth: '100%',
        width: isMobile ? '95%' : '400px', 
        margin: '0.5em',
        position: 'relative',
        borderRadius: '10px',
        boxShadow: 1,
        overflow: 'hidden',
        padding: isMobile ? '0.5em' : '1em',
      }}
    >
      <CardMedia
        component="div"
        onClick={handleChoose}
        sx={{
          cursor: 'pointer',
          paddingBottom: '56.25%', 
          position: 'relative',
          backgroundColor: theme.palette.grey[500],
        }}
      >
        {localSource ? (
          <video
            style={{ width: '100%', height: 'auto' }}
            controls
            src={localSource}
          />
        ) : (
          <IconButton sx={{ width: '60%', height: '60%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <VideoCallRoundedIcon sx={{ width: '100%', height: '100%' }} />
          </IconButton>
        )}
      </CardMedia>
      <CardContent sx={{ padding: isMobile ? '0.5em' : '1em' }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ marginBottom: '0.5em' }}
        >
          <Input
            defaultValue={`New title ${fragment}`}
            fullWidth
            disableUnderline
            sx={{
              padding: '0.5em',
              border: 'none',
              backgroundColor: theme.palette.background.paper, 
            }}
          />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          part #{fragment}
        </Typography>
      </CardContent>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        accept=".mov,.mp4"
        style={{ display: 'none' }}
      />
      <IconButton
        sx={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          color: theme.palette.grey[700],
        }}
        onClick={onDelete}
      >
        <DeleteIcon />
      </IconButton>
    </Card>
  );
}
