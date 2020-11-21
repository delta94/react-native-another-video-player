import React, {FC} from 'react';
import {View, Modal} from 'react-native';

const ParentContainer: FC<any> = (props: any) => {
  if (props.isFullscreen) {
    return (
      <Modal
        visible={props.isFullscreen}
        animationType={'fade'}
        transparent={true}
        onRequestClose={props.onRequestClose}
        supportedOrientations={['landscape', 'portrait']}>
        <View {...props}>{props.children}</View>
      </Modal>
    );
  } else {
    return <View {...props}>{props.children}</View>;
  }
};

export default ParentContainer;
