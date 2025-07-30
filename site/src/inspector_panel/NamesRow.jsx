import "./NamesRow.css";

function NamesRow({ entity, mode }) {
  const names = JSON.parse(entity["names"]);

  // Function to check if a value is a URL
  const isURL = (value) => {
    if (!value || typeof value !== 'string') return false;
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Function to render a single URL as a clickable link
  const renderURL = (url) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#3b82f6',
        textDecoration: 'underline',
        wordBreak: 'break-all'
      }}
    >
      {url}
    </a>
  );

  // Function to render value as link or text, handling arrays and objects
  const renderValue = (value) => {
    // Handle null/undefined
    if (value == null) return 'null';

    // Handle strings first to check for JSON
    const stringValue = value.toString();

    // Try to parse as JSON if it looks like an array or object
    if ((stringValue.startsWith('[') && stringValue.endsWith(']')) ||
        (stringValue.startsWith('{') && stringValue.endsWith('}'))) {
      try {
        const parsed = JSON.parse(stringValue);
        return renderValue(parsed);
      } catch {
        // If parsing fails, fall through to regular string handling
      }
    }

    // Handle arrays - render inline for simple arrays, nested for complex ones
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';

      // Check if all items are URLs
      const allURLs = value.every(item => isURL(item));

      // Check if all items are simple (strings, numbers, booleans)
      const allSimple = value.every(item =>
        typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean'
      );

      if (allURLs) {
        // Render URL arrays as clickable links
        return (
          <div className="nested-content">
            {value.map((item, index) => (
              <div key={index} className="nested-item">
                {renderURL(item)}
              </div>
            ))}
          </div>
        );
      } else if (allSimple && value.length <= 3) {
        // Render simple arrays inline
        return `[${value.join(', ')}]`;
      }

      // Render complex or long arrays nested
      return (
        <div className="nested-content">
          {value.map((item, index) => (
            <div key={index} className="nested-item">
              {renderValue(item)}
            </div>
          ))}
        </div>
      );
    }

    // Handle objects
    if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) return '{}';

      return (
        <div className="nested-content">
          {entries.map(([key, val]) => (
            <div key={key} className="nested-item">
              <span className="nested-key">
                {key}:
              </span>{' '}
              {renderValue(val)}
            </div>
          ))}
        </div>
      );
    }

    // Check if it's a URL
    if (isURL(stringValue)) {
      return renderURL(stringValue);
    }

    return stringValue;
  };

  return (
    <div className="panel-row names">
      <div>
        <strong>names: </strong>
        <div className="name-content">
          {names.primary != null ? (
            <p><strong>primary: </strong>{names.primary}</p>
          ) : (
            <></>
          )}

          {names.common != null ? (
            <p><strong>common: </strong>{renderValue(names.common)}</p>
          ) : (
            <></>
          )}

          {names.rules != null ? (
            <p><strong>rules: </strong>{renderValue(names.rules)}</p>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default NamesRow;
