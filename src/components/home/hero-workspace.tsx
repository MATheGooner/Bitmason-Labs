import { BusinessJourney } from "./business-journey";

export function HeroWorkspace() {
  return <figure className="hero-figure">
    <p className="drawing-label">From interest to action</p>
    <BusinessJourney compact />
    <figcaption>Customer journeys, connected to the work behind them.</figcaption>
  </figure>;
}
