import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.5;
const VISIBLE_OFFSET = (SCREEN_HEIGHT - CARD_HEIGHT) / 4;
const SNAP_TO_INTERVAL = CARD_HEIGHT + 40

export { SCREEN_WIDTH, SCREEN_HEIGHT, CARD_WIDTH, CARD_HEIGHT, VISIBLE_OFFSET, SNAP_TO_INTERVAL }