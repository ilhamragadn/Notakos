import React from 'react';
import {View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

const ProfilIcon = ({isFocused}: any) => {
  return (
    <View>
      {isFocused ? (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="#0284C7">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
          />
        </Svg>
      ) : (
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0284C7"
          strokeWidth={1.5}>
          <Path
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    </View>
  );
};

export default ProfilIcon;
