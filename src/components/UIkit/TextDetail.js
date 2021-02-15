import React, {useCallback, useMamo} from 'react';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
  row: {
    display: "flex",
    flexFlow: "row wrap",
    marginBottom: 16
  },
  label: {
    marginLeft: 0,
    marginRight: "auto"
  },
  value: {
    fontWeight: 600,
    marginRight: 0,
    marginLeft: "auto"
  }
});

const TextDetail = props => {
  const classes = useStyles();

  return (
    <div className={classes.row}>
      <div className={classes.label}>{props.label}</div>
      <div className={classes.value}>{props.value}</div>
    </div>
  )
}

export default TextDetail;
