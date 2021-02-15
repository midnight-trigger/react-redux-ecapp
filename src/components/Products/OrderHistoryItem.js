import React from 'react';
import Divider from '@material-ui/core/Divider';
import {TextDetail} from '../UIkit';
import {OrderedProducts} from './';

const datetimeToString = date => {
  return date.getFullYear() + "-" + ("00" + (date.getMonth() + 1)).slice(-2) + "-" + ("00" + date.getDate()).slice(-2) + " " + ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2) + ":" + ("00" + date.getSeconds()).slice(-2);
}

const OrderHistoryItem = props => {
  return (
    <div>
      <div className="module-spacer--small" />
      <TextDetail label="注文ID" value={props.order.id} />
      <TextDetail label="注文日時" value={datetimeToString(props.order.updated_at.toDate())} />
      <TextDetail label="発送予定日" value={datetimeToString(props.order.shipping_date.toDate())} />
      <TextDetail label="注文金額" value={"¥" + props.order.amount.toLocaleString()} />
      {props.order.products.length > 0 && (
        <OrderedProducts products={props.order.products} />
      )}
      <div className="module-spacer--extra-extra-small" />
      <Divider />
    </div>
  )
}

export default OrderHistoryItem;
