import React from 'react';
import { BodyRegionId, BodyRegionDef, BODY_REGIONS } from '../../types/painData';

export { BODY_REGIONS };
export type { BodyRegionId, BodyRegionDef };

interface BodyMapSvgProps {
  selectedRegion: BodyRegionId | null;
  onSelectRegion: (region: BodyRegionId) => void;
  orientation: 'front' | 'back';
}

export const BodyMapSvg: React.FC<BodyMapSvgProps> = ({
  selectedRegion,
  onSelectRegion,
  orientation,
}) => {
  const isSelected = (id: BodyRegionId) => selectedRegion === id;

  const getFillColor = (id: BodyRegionId) => {
    if (isSelected(id)) {
      return '#ef4444'; // Bright Red highlight
    }
    return '#334155'; // Dark slate normal
  };

  const getStrokeColor = (id: BodyRegionId) => {
    if (isSelected(id)) {
      return '#fef08a'; // Bright yellow border
    }
    return '#64748b'; // Slate border
  };

  // Anatomical orientation mapping:
  // In Front view (facing patient), screen-left is the patient's Right side, and screen-right is the patient's Left side.
  // In Back view (facing away), screen-left is the patient's Left side, and screen-right is the patient's Right side.
  const screenLeftArm: BodyRegionId = orientation === 'front' ? 'right-arm' : 'left-arm';
  const screenLeftHand: BodyRegionId = orientation === 'front' ? 'right-hand' : 'left-hand';
  const screenRightArm: BodyRegionId = orientation === 'front' ? 'left-arm' : 'right-arm';
  const screenRightHand: BodyRegionId = orientation === 'front' ? 'left-hand' : 'right-hand';

  const screenLeftLeg: BodyRegionId = orientation === 'front' ? 'right-leg' : 'left-leg';
  const screenLeftFoot: BodyRegionId = orientation === 'front' ? 'right-foot' : 'left-foot';
  const screenRightLeg: BodyRegionId = orientation === 'front' ? 'left-leg' : 'right-leg';
  const screenRightFoot: BodyRegionId = orientation === 'front' ? 'left-foot' : 'right-foot';

  return (
    <div className="w-full flex-1 min-h-0 max-h-[340px] flex items-center justify-center p-0 overflow-hidden">
      <svg
        viewBox="64 6 172 378"
        className="w-full h-full max-w-[205px] sm:max-w-[225px] select-none filter drop-shadow-xl"
        role="group"
        aria-label={`Interactive ${orientation} body map`}
      >
        {/* Head */}
        <circle
          cx="150"
          cy="45"
          r="32"
          fill={getFillColor('head')}
          stroke={getStrokeColor('head')}
          strokeWidth={isSelected('head') ? 5 : 2}
          className="cursor-pointer transition-colors duration-150 hover:brightness-125"
          onClick={() => onSelectRegion('head')}
        />
        {orientation === 'front' ? (
          <>
            <text x="150" y="24" textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="bold" pointerEvents="none">
              Head
            </text>
            {/* Eyes */}
            <circle cx="140" cy="38" r="3" fill="#f8fafc" pointerEvents="none" />
            <circle cx="160" cy="38" r="3" fill="#f8fafc" pointerEvents="none" />
            {/* Smile */}
            <path
              d="M 138 49 Q 150 60 162 49"
              fill="none"
              stroke="#f8fafc"
              strokeWidth="3"
              strokeLinecap="round"
              pointerEvents="none"
            />
          </>
        ) : (
          <text x="150" y="49" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="bold" pointerEvents="none">
            Head
          </text>
        )}

        {/* Throat (Front) or Neck (Back) */}
        <rect
          x="136"
          y="77"
          width="28"
          height="18"
          rx="5"
          fill={getFillColor(orientation === 'front' ? 'throat' : 'neck')}
          stroke={getStrokeColor(orientation === 'front' ? 'throat' : 'neck')}
          strokeWidth={isSelected(orientation === 'front' ? 'throat' : 'neck') ? 4 : 2}
          className="cursor-pointer transition-colors duration-150 hover:brightness-125"
          onClick={() => onSelectRegion(orientation === 'front' ? 'throat' : 'neck')}
        />

        {orientation === 'front' ? (
          <>
            {/* Chest (wider) */}
            <path
              d="M 106 95 L 194 95 L 184 148 L 116 148 Z"
              fill={getFillColor('chest')}
              stroke={getStrokeColor('chest')}
              strokeWidth={isSelected('chest') ? 5 : 2}
              className="cursor-pointer transition-colors duration-150 hover:brightness-125"
              onClick={() => onSelectRegion('chest')}
            />
            <text x="150" y="127" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="bold" pointerEvents="none">
              Chest
            </text>

            {/* Stomach (wider) */}
            <path
              d="M 116 152 L 184 152 L 180 200 L 120 200 Z"
              fill={getFillColor('stomach')}
              stroke={getStrokeColor('stomach')}
              strokeWidth={isSelected('stomach') ? 5 : 2}
              className="cursor-pointer transition-colors duration-150 hover:brightness-125"
              onClick={() => onSelectRegion('stomach')}
            />
            <text x="150" y="181" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="bold" pointerEvents="none">
              Stomach
            </text>
          </>
        ) : (
          <>
            {/* Upper Back (wider) */}
            <path
              d="M 106 95 L 194 95 L 184 148 L 116 148 Z"
              fill={getFillColor('upper-back')}
              stroke={getStrokeColor('upper-back')}
              strokeWidth={isSelected('upper-back') ? 5 : 2}
              className="cursor-pointer transition-colors duration-150 hover:brightness-125"
              onClick={() => onSelectRegion('upper-back')}
            />
            <text x="150" y="127" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" pointerEvents="none">
              Upper Back
            </text>

            {/* Lower Back (wider) */}
            <path
              d="M 116 152 L 184 152 L 180 200 L 120 200 Z"
              fill={getFillColor('lower-back')}
              stroke={getStrokeColor('lower-back')}
              strokeWidth={isSelected('lower-back') ? 5 : 2}
              className="cursor-pointer transition-colors duration-150 hover:brightness-125"
              onClick={() => onSelectRegion('lower-back')}
            />
            <text x="150" y="181" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" pointerEvents="none">
              Lower Back
            </text>
          </>
        )}

        {/* Hips (Front) or Butt (Back) */}
        {orientation === 'front' ? (
          <>
            <path
              d="M 120 204 L 180 204 L 188 238 L 112 238 Z"
              fill={getFillColor('hips')}
              stroke={getStrokeColor('hips')}
              strokeWidth={isSelected('hips') ? 5 : 2}
              className="cursor-pointer transition-colors duration-150 hover:brightness-125"
              onClick={() => onSelectRegion('hips')}
            />
            <text x="150" y="226" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" pointerEvents="none">
              Hips
            </text>
          </>
        ) : (
          <>
            {/* Butt (rounded double-cheek silhouette) */}
            <path
              d="M 120 204 L 180 204 C 188 204 192 212 192 222 C 192 235 180 242 166 242 C 158 242 153 238 150 233 C 147 238 142 242 134 242 C 120 242 108 235 108 222 C 108 212 112 204 120 204 Z"
              fill={getFillColor('butt')}
              stroke={getStrokeColor('butt')}
              strokeWidth={isSelected('butt') ? 5 : 2}
              className="cursor-pointer transition-colors duration-150 hover:brightness-125"
              onClick={() => onSelectRegion('butt')}
            />
            {/* Center cleft crease */}
            <path
              d="M 150 233 L 150 217"
              fill="none"
              stroke={isSelected('butt') ? '#fef08a' : '#64748b'}
              strokeWidth={isSelected('butt') ? 3 : 2}
              strokeLinecap="round"
              pointerEvents="none"
            />
            <text x="150" y="214" textAnchor="middle" fill="#f8fafc" fontSize="10.5" fontWeight="bold" pointerEvents="none">
              Butt
            </text>
          </>
        )}

        {/* Screen-Left Arm & Hand */}
        <rect
          x="72"
          y="99"
          width="28"
          height="94"
          rx="12"
          fill={getFillColor(screenLeftArm)}
          stroke={getStrokeColor(screenLeftArm)}
          strokeWidth={isSelected(screenLeftArm) ? 4 : 2}
          className="cursor-pointer transition-colors duration-150 hover:brightness-125"
          onClick={() => onSelectRegion(screenLeftArm)}
        />
        <text x="86" y="151" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" pointerEvents="none">
          Arm
        </text>
        <circle
          cx="86"
          cy="216"
          r="14"
          fill={getFillColor(screenLeftHand)}
          stroke={getStrokeColor(screenLeftHand)}
          strokeWidth={isSelected(screenLeftHand) ? 4 : 2}
          className="cursor-pointer transition-colors duration-150 hover:brightness-125"
          onClick={() => onSelectRegion(screenLeftHand)}
        />
        <text x="86" y="219" textAnchor="middle" fill="#f8fafc" fontSize="8.5" fontWeight="bold" pointerEvents="none">
          Hand
        </text>

        {/* Screen-Right Arm & Hand */}
        <rect
          x="200"
          y="99"
          width="28"
          height="94"
          rx="12"
          fill={getFillColor(screenRightArm)}
          stroke={getStrokeColor(screenRightArm)}
          strokeWidth={isSelected(screenRightArm) ? 4 : 2}
          className="cursor-pointer transition-colors duration-150 hover:brightness-125"
          onClick={() => onSelectRegion(screenRightArm)}
        />
        <text x="214" y="151" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" pointerEvents="none">
          Arm
        </text>
        <circle
          cx="214"
          cy="216"
          r="14"
          fill={getFillColor(screenRightHand)}
          stroke={getStrokeColor(screenRightHand)}
          strokeWidth={isSelected(screenRightHand) ? 4 : 2}
          className="cursor-pointer transition-colors duration-150 hover:brightness-125"
          onClick={() => onSelectRegion(screenRightHand)}
        />
        <text x="214" y="219" textAnchor="middle" fill="#f8fafc" fontSize="8.5" fontWeight="bold" pointerEvents="none">
          Hand
        </text>

        {/* Screen-Left Leg */}
        <rect
          x="113"
          y="246"
          width="29"
          height="98"
          rx="12"
          fill={getFillColor(screenLeftLeg)}
          stroke={getStrokeColor(screenLeftLeg)}
          strokeWidth={isSelected(screenLeftLeg) ? 5 : 2}
          className="cursor-pointer transition-colors duration-150 hover:brightness-125"
          onClick={() => onSelectRegion(screenLeftLeg)}
        />
        <text x="127.5" y="302" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" pointerEvents="none">
          Leg
        </text>

        {/* Screen-Right Leg */}
        <rect
          x="158"
          y="246"
          width="29"
          height="98"
          rx="12"
          fill={getFillColor(screenRightLeg)}
          stroke={getStrokeColor(screenRightLeg)}
          strokeWidth={isSelected(screenRightLeg) ? 5 : 2}
          className="cursor-pointer transition-colors duration-150 hover:brightness-125"
          onClick={() => onSelectRegion(screenRightLeg)}
        />
        <text x="172.5" y="302" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" pointerEvents="none">
          Leg
        </text>

        {/* Screen-Left Foot */}
        <rect
          x="104"
          y="350"
          width="38"
          height="25"
          rx="8"
          fill={getFillColor(screenLeftFoot)}
          stroke={getStrokeColor(screenLeftFoot)}
          strokeWidth={isSelected(screenLeftFoot) ? 5 : 2}
          className="cursor-pointer transition-colors duration-150 hover:brightness-125"
          onClick={() => onSelectRegion(screenLeftFoot)}
        />
        <text x="123" y="367" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" pointerEvents="none">
          Foot
        </text>

        {/* Screen-Right Foot */}
        <rect
          x="158"
          y="350"
          width="38"
          height="25"
          rx="8"
          fill={getFillColor(screenRightFoot)}
          stroke={getStrokeColor(screenRightFoot)}
          strokeWidth={isSelected(screenRightFoot) ? 5 : 2}
          className="cursor-pointer transition-colors duration-150 hover:brightness-125"
          onClick={() => onSelectRegion(screenRightFoot)}
        />
        <text x="177" y="367" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" pointerEvents="none">
          Foot
        </text>
      </svg>
    </div>
  );
};
