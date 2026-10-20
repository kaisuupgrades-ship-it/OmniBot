// window.omnibot belongs in the application adapter.
export const documentation = "window.omnibot";
export const viewport = () => window.innerWidth;
export const platformAction = (props: { omnibot: () => void }) => props.omnibot();
