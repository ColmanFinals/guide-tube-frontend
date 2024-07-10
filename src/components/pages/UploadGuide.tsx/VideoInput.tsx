import { useRef, useState, ChangeEvent } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded';
import Input from '@mui/material/Input';

type VideoInputProps = {
  fragment: number;
};

export default function VideoInput({ fragment }: VideoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<string | undefined>(undefined);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      setSource(url);
    }
  };

  const handleChoose = () => {
    inputRef.current?.click();
  };

  return (
    <Card className="flex flex-row justify-between items-center" sx={{width: "90vw" ,margin: "0.5em"}}>
      <Box className="flex flex-col">
        <CardContent className="card-content flex-col flex items-start">
          <Typography component="div" variant="h5">
            <Input id="standard-basic" defaultValue="New title" />
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div" sx={{margin:"0.5em"}}>
            part #{fragment}
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="div"
        className="card-media"
        onClick={handleChoose}
      >
        {source ? (
          <video style={{width: "6em", height:"7em", marginRight:"0.3em"}}
            className="video"
            controls
            src={source}
          />
        ) : (
          <IconButton sx={{width: "3em", height:"3em", marginRight:"0.3em"}}>
            <VideoCallRoundedIcon className="icon-button" sx={{width: "3em", height:"3em"}}/>
          </IconButton>
        )}
      </CardMedia>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        accept=".mov,.mp4"
        style={{ display: "none" }}
      />
    </Card>
  );
}


