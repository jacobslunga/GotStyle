import SingleOutfitScreen from "../../screens/App/SingleOutfitScreen";
import EditProfileScreen from "../../screens/App/EditProfileScreen";
import TakeOutfitScreen from "../../screens/App/Upload/TakeOutfitScreen";
import UploadScreen from "../../screens/App/Upload/UploadScreen";
import UserFollowsScreen from "../../screens/App/UserFollowsScreen";
import CommentScreen from "../../screens/App/Comments/CommentScreen";
import HashtagModalScreen from "../../screens/App/HashtagModalScreen";
import SelectedOutfitsScreen from "../../screens/App/Upload/SelectedOutfitsScreen";
import ReplyToCommentScreen from "../../screens/App/Comments/ReplyToCommentScreen";
import AddLinksScreen from "../../screens/App/Upload/AddLinksScreen";
import HomeScreen from "../../screens/App/HomeScreen";
import ProfileScreen from "../../screens/App/Profiles/ProfileScreen";
import AddLinkScreen from "../../screens/App/Upload/AddLinkScreen";
import NotificationsScreen from "../../screens/App/NotificationsScreen";

const defaultOptions = {
  headerShown: false,
};

export const mainConfig = [
  {
    name: "Home",
    component: HomeScreen,
    options: {
      ...defaultOptions,
    },
  },
  {
    name: "Profile",
    component: ProfileScreen,
    options: {
      ...defaultOptions,
      animation: "simple_push",
    },
  },
  {
    name: "HashtagModal",
    component: HashtagModalScreen,
    options: {
      ...defaultOptions,
      animation: "fade",
      presentation: "transparentModal",
    },
  },
  {
    name: "SelectedOutfits",
    component: SelectedOutfitsScreen,
    options: {
      ...defaultOptions,
      animation: "fade",
      presentation: "transparentModal",
    },
  },
  {
    name: "SingleOutfit",
    component: SingleOutfitScreen,
    options: {
      ...defaultOptions,
      animation: "fade",
      presentation: "formSheet",
    },
  },
  {
    name: "TakeOutfit",
    component: TakeOutfitScreen,
    options: {
      ...defaultOptions,
      presentation: "fullScreenModal",
    },
  },
  {
    name: "Upload",
    component: UploadScreen,
    options: {
      ...defaultOptions,
      animation: "fade",
      presentation: "fullScreenModal",
    },
  },
  {
    name: "UserFollows",
    component: UserFollowsScreen,
    options: {
      ...defaultOptions,
      animation: "slide_from_bottom",
      presentation: "fullScreenModal",
    },
  },
  {
    name: "EditProfile",
    component: EditProfileScreen,
    options: {
      ...defaultOptions,
      animation: "slide_from_bottom",
      presentation: "containedModal",
    },
  },
  {
    name: "Comment",
    component: CommentScreen,
    options: {
      ...defaultOptions,
      animation: "fade",
      presentation: "fullScreenModal",
    },
  },
  {
    name: "ReplyToComment",
    component: ReplyToCommentScreen,
    options: {
      ...defaultOptions,
      presentation: "formSheet",
    },
  },
  {
    name: "AddLinks",
    component: AddLinksScreen,
    options: {
      ...defaultOptions,
      presentation: "formSheet",
    },
  },
  {
    name: "AddLink",
    component: AddLinkScreen,
    options: {
      ...defaultOptions,
      presentation: "formSheet",
    },
  },
  {
    name: "Notifications",
    component: NotificationsScreen,
    options: {
      ...defaultOptions,
      presentation: "formSheet",
      animation: "slide_from_bottom",
    },
  },
];
