export type Testimonial = {
  quote: string;
  rating: number; // out of 5
};

// PLACEHOLDER LAYOUT ONLY. These are sample lines that hold the space
// until real, attributable client quotes are collected. They are
// deliberately not attributed to any person, and the work page labels
// the section as an example so nothing reads as a genuine review.
export const testimonials: Testimonial[] = [
  {
    quote:
      "A short line about how the project went and what shipping it changed for the team.",
    rating: 5,
  },
  {
    quote:
      "An example of the kind of feedback that will live here once real client reviews come in.",
    rating: 5,
  },
  {
    quote:
      "One more sample, roughly the length of a real testimonial so the layout reads true.",
    rating: 5,
  },
];
