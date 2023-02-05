import { makeStyles } from '@material-ui/core/styles';
import { darken } from "@material-ui/core/styles/colorManipulator";

export const useButtonStyles = makeStyles(theme => ({
  add: {
    backgroundColor: '#1B998B',
  },
  remove: {
    backgroundColor: theme.palette.error.main,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: darken(theme.palette.error.main, 0.2)
    }
  },
  rightMargin: {
    marginRight: theme.spacing(2),
  }
}));

export const useLabelStyles = makeStyles(theme => ({
  fontSize: {
    fontSize: '12px !important',
  },
}));
