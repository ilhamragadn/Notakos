import React from 'react';
import {View} from 'react-native';
import {Path, Svg} from 'react-native-svg';

const AlokasiIcon = ({isFocused}: any) => {
  return (
    <View>
      {isFocused ? (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="#0284C7">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z"
          />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z"
          />
        </Svg>
      ) : (
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0284C7"
          strokeWidth={1.8}>
          <Path
            d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    </View>
  );
};

export default AlokasiIcon;
