import { useMemo } from 'react';
import { geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { FeatureCollection, Geometry } from 'geojson';
import type { CostComparison } from '../../types';
import { getStateColor } from '../../calc';
import { StateShape } from './StateShape';
import { fipsToAbbr } from './fips-to-abbr';
import topoData from '../../data/states-albers-10m.json';
import styles from './USMap.module.css';

interface USMapProps {
  costsByState: Record<string, CostComparison>;
  onStateHover: (stateAbbr: string | null, event: React.MouseEvent) => void;
  onStateClick: (stateAbbr: string) => void;
}

interface StateFeatureProperties {
  name: string;
}

// Null projection for pre-projected coordinates
const pathGenerator = geoPath(null);

export function USMap({ costsByState, onStateHover, onStateClick }: USMapProps) {
  const stateFeatures = useMemo(() => {
    const topo = topoData as unknown as Topology<{
      states: GeometryCollection<StateFeatureProperties>;
    }>;
    const fc = feature(topo, topo.objects.states) as FeatureCollection<
      Geometry,
      StateFeatureProperties
    >;
    return fc.features;
  }, []);

  return (
    <div className={styles.mapContainer}>
      <svg
        className={styles.mapSvg}
        viewBox="0 0 975 610"
        role="img"
        aria-label="US map showing EV vs gas cost comparison by state"
      >
        {stateFeatures.map((feat) => {
          const fips = String(feat.id);
          const abbr = fipsToAbbr[fips];
          if (!abbr) return null;

          const comparison = costsByState[abbr];
          const fillColor = comparison
            ? getStateColor(comparison.monthlyDifference)
            : '#e2e8f0';

          const d = pathGenerator(feat);
          if (!d) return null;

          return (
            <StateShape
              key={abbr}
              d={d}
              stateAbbr={abbr}
              fillColor={fillColor}
              onHover={onStateHover}
              onClick={onStateClick}
            />
          );
        })}
      </svg>
    </div>
  );
}
