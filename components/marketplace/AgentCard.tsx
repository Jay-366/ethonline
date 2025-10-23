
import React from "react";

/*
 * AgentCard component
 *
 * This component replicates the card design shown in the provided image, using
 * only the colour palette specified by the user. It omits the logo and the
 * emoji beside the agent name, presenting a clean, dark card with a title,
 * description, rating row, tags and price. Everything is self-contained,
 * making it easy to drop into a React / Next.js project that uses TailwindCSS
 * or similar utility classes.  If you don't use Tailwind, you can convert
 * the className values into your own CSS definitions.
 */

export type AgentCardProps = {
  /**
   * The display name of the agent (e.g., "AgentOps").
   */
  name: string;
  /**
   * Short description of the agent. Long descriptions are truncated via
   * CSS (line-clamp) to keep the card height consistent.
   */
  description: string;
  /**
   * Rating out of 5. For example, 4.3 means four and a bit stars.
   */
  rating: number;
  /**
   * Total number of reviews. Displayed in parenthesis after the stars.
   */
  reviews: number;
  /**
   * Tags describing the agent, rendered as small pill badges.
   */
  tags: string[];
  /**
   * Price string to display (e.g., "$20/mon").
   */
  price: string;
  /**
   * Optional callback when the deploy button is clicked.
   */
  onDeploy?: () => void;
};

/*
 * Render a star icon as SVG. The `filled` prop determines whether the star
 * should be filled (using the primary text colour) or outlined (using the
 * accent colour). All colours are pulled from the allowed palette.
 */
const Star: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill={filled ? '#f8ede0' : '#5d606c'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 6.091 1.484 8.603L12 18.897l-7.42 4.103 1.484-8.603L0 9.306l8.332-1.151z" />
  </svg>
);

/*
 * AgentCard component implementation. Uses a dark background with light text
 * and accent colours drawn from the palette provided by the user. The card
 * includes a dismiss button in the top right corner, a title, a truncated
 * description, a rating row with stars, a divider, tags and the price.
 */
export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  description,
  rating,
  reviews,
  tags,
  price,
  onDeploy,
}) => {
  // Determine how many stars should appear filled based on the rating.
  const filledStars = Math.round(rating);

  return (
    <div
      className="relative overflow-hidden rounded-3xl text-[#f8ede0] cursor-pointer transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, #1C1F2B 0%, #252a36 100%)',
        border: '1px solid rgba(251, 237, 224, 0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.borderColor = 'rgba(251, 237, 224, 0.2)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(251, 237, 224, 0.08), 0 0 60px rgba(147, 112, 219, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(251, 237, 224, 0.1)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(251, 237, 224, 0.04)';
      }}
    >
      {/* Gradient background glow effect */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(147, 112, 219, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Card content */}
      <div className="relative z-10 p-4">
        {/* Name / title */}
        <h3 className="text-lg font-semibold leading-tight text-[#f8ede0]">
          {name}
        </h3>

        {/* Description (truncated) */}
        <p className="mt-2 text-sm leading-relaxed text-[#5d606c] line-clamp-2">
          {description}
        </p>

        {/* Rating section */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-[#f8ede0]">
            {rating.toFixed(1)}/5
          </span>
          <div className="flex space-x-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} filled={index < filledStars} />
            ))}
          </div>
          <span className="text-xs text-[#5d606c]">
            ({reviews.toLocaleString()} Reviews)
          </span>
        </div>

        {/* Divider line */}
        <div className="my-3 h-px w-full bg-[#5d606c]" />

        {/* Tags and price row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#5d606c] px-2.5 py-0.5 text-xs text-[#f8ede0]"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="whitespace-nowrap text-base font-semibold text-[#f8ede0]">
            {price}
          </span>
        </div>

        {/* Deploy Button */}
        <button
          className="mt-4 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: '#fbede0',
            color: '#161823',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(147, 112, 219, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDeploy?.();
          }}
        >
          Deploy Agent
        </button>
      </div>
    </div>
  );
};
