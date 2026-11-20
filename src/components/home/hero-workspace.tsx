import { BusinessJourney } from "./business-journey";

export function HeroWorkspace() {
  return <figure className="hero-figure">
    <div className="drawing-label"><span>From interest to action</span><span aria-hidden="true">+</span></div>
    <BusinessJourney compact />
    <ul className="hero-connections" role="list" aria-label="Connected capabilities"><li>Customer website</li><li>Business system</li><li>Intelligent workflow</li></ul>
    <figcaption>Thoughtful experiences. Connected information. Useful next steps.</figcaption>
  </figure>;
}
