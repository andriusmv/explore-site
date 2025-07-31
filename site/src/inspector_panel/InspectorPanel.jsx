import PropTypes from "prop-types";
import TableRow from "./TableRow";
import "./InspectorPanel.css";
import CloseIcon from "@mui/icons-material/Close";
import ThemePanel from "./ThemePanel";
import {
  BASE_TIPS,
  BUILDING_TIPS,
  DIVISION_TIPS,
  PLACES_TIPS,
  TRANSPORTATION_TIPS,
  ADDRESSES_TIPS,
} from "./TipLibrary";

function InspectorPanel({
  mode,
  setFeatures,
  activeThemes,
  setActiveThemes,
  activeFeature,
  setActiveFeature,
}) {
  if (!activeFeature) {
    return;
  }

  const entity = {
    theme: activeFeature.source,
    type: activeFeature.sourceLayer,
    ...activeFeature.properties,
  };

  const theme = entity["theme"];

  // Determine the panel title - use name if available, otherwise default
  let panelTitle = "Inspector Panel";
  if (entity["names"]) {
    try {
      const names = JSON.parse(entity["names"]);
      if (names["primary"]) {
        panelTitle = names["primary"];
      }
    } catch (e) {
      // If parsing fails, keep default title
    }
  }

  let inspectorPanel = <div></div>;

  if (theme === "base") {
    inspectorPanel = (
      <ThemePanel
        mode={mode}
        entity={entity}
        tips={BASE_TIPS}
        activeThemes={activeThemes}
        setActiveThemes={setActiveThemes}
      />
    );
  } else if (theme === "buildings") {
    inspectorPanel = (
      <ThemePanel
        mode={mode}
        entity={entity}
        tips={BUILDING_TIPS}
        activeThemes={activeThemes}
        setActiveThemes={setActiveThemes}
      />
    );
  } else if (theme === "divisions") {
    inspectorPanel = (
      <ThemePanel
        mode={mode}
        entity={entity}
        tips={DIVISION_TIPS}
        activeThemes={activeThemes}
        setActiveThemes={setActiveThemes}
      />
    );
  } else if (theme === "places") {
    inspectorPanel = (
      <ThemePanel
        mode={mode}
        entity={entity}
        tips={PLACES_TIPS}
        activeThemes={activeThemes}
        setActiveThemes={setActiveThemes}
      />
    );
  } else if (theme === "transportation") {
    inspectorPanel = (
      <ThemePanel
        mode={mode}
        entity={entity}
        tips={TRANSPORTATION_TIPS}
        activeThemes={activeThemes}
        setActiveThemes={setActiveThemes}
      />
    );
  } else if (theme === "addresses") {
    inspectorPanel = (
      <ThemePanel
        mode={mode}
        entity={entity}
        tips={ADDRESSES_TIPS}
        activeThemes={activeThemes}
        setActiveThemes={setActiveThemes}
      />
    );
  } else if (theme === "addresses") {
    inspectorPanel = (
      <ThemePanel mode={mode} entity={entity} tips={ADDRESSES_TIPS} />
    );
  } else {
    console.log("unhandled theme type");
    console.log(entity);

    // Get all keys except those starting with @
    const allKeys = Object.keys(entity).filter((key) => !key.startsWith("@"));

    // Create custom ordering for class/subclass hierarchy
    const orderedKeys = [];
    const processedKeys = new Set();

    // First pass: add all keys except subclass
    allKeys.forEach(key => {
      if (key !== "subclass") {
        orderedKeys.push({ key, indented: false });
        processedKeys.add(key);

        // If this is "class" and "subclass" exists, add subclass right after
        if (key === "class" && entity.hasOwnProperty("subclass")) {
          orderedKeys.push({ key: "subclass", indented: true });
          processedKeys.add("subclass");
        }
      }
    });

    // Second pass: add any remaining keys that weren't processed
    allKeys.forEach(key => {
      if (!processedKeys.has(key)) {
        orderedKeys.push({ key, indented: false });
      }
    });

    inspectorPanel = (
      <table>
        <tbody>
          {orderedKeys.map(({ key, indented }) => (
            <TableRow
              key={key}
              mode={mode}
              table_key={key}
              entity={entity}
              indented={indented}
            />
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="inspector-panel">
      <div className="panel-header">
        <h6 className="title">{panelTitle}</h6>
        <button
          className="close-panel-button"
          onClick={() => {
            setFeatures([]);
            setActiveFeature(null);
          }}
        >
          <CloseIcon className="close-panel-icon" />
        </button>
      </div>
      {inspectorPanel}
      <p>
        <a
          href="https://docs.overturemaps.org/schema/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Overture Schema Reference
        </a>
      </p>
    </div>
  );
}

InspectorPanel.propTypes = {
  entity: PropTypes.object,
};
export default InspectorPanel;
