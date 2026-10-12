// Profile details and verified links. Sources: public/Rajguru_Resume.pdf and the linked GitHub profile.

export const SITE_URL = "https://portfolio-eight-kappa-95.vercel.app";

export const profile = {
  name: "Rajguru Mathiyalagan",
  location: "Mumbai, India",
  email: "rajguru21.ds@gmail.com",
  roles: "Data Analyst, Data Scientist and Machine Learning Engineer",
};

// Illustrated portrait used in the hero. Resized WebP copies of public/images/avatar.png with the top 80px of empty
// background trimmed (removes a faint mark embedded in the source); nothing else cropped.
export const avatar = {
  srcSet: "/images/avatar-480.webp 480w, /images/avatar-760.webp 760w, /images/avatar-1070.webp 1070w",
  src: "/images/avatar-760.webp",
  width: 1070,
  height: 1390,
  alt: "Illustrated 3D portrait of Rajguru Mathiyalagan: curly dark hair, glasses, moustache and chin beard, wearing a dark overshirt over a black T-shirt.",
};

export const links = {
  github: "https://github.com/RajguruDs",
  linkedin: "https://www.linkedin.com/in/rajguru-mathiyalagan-63b921244",
  email: `mailto:${profile.email}`,
  resume: "/Rajguru_Resume.pdf",
};

// Section anchors on the home page, in page order.
export const homeSections = [
  { id: "top", label: "Home" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export type HomeSectionId = (typeof homeSections)[number]["id"];
