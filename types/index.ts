export interface ContentItem {
  title: string;
  paragraph: string;
  image: string;
}

export interface ScrollbarItem {
  img: string;
  text: string;
}

export interface Post {
  _id: string;
  user: {
    _id: string;
    name: string;
    profilePic: string;
  };
  url: string;
  prompt: string;
  visitingTime: string[];
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
};