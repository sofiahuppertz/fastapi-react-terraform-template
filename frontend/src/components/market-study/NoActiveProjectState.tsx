import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { text, palettes } from '../../config/colors';

export function NoActiveProjectState() {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border" style={{ borderColor: palettes.grey.grey1 }}>
      <div
        className="h-16 w-16 mx-auto mb-4 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: palettes.blue.blue1
        }}
      >
        <FontAwesomeIcon
          icon={faGlobe}
          className="h-8 w-8"
          style={{
            color: palettes.blue.blue3
          }}
        />
      </div>
      <h3
        className="text-lg font-medium mb-2 font-space"
        style={{
          color: text.primary
        }}
      >
        No Active Project
      </h3>
      <p
        className="mb-4 font-satoshi"
        style={{
          color: text.secondary
        }}
      >
        Please select an active project first to view market studies
      </p>
    </div>
  );
}

