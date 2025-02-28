import {expose} from "comlink";
import {MandelbrotService} from "./MandelbrotService";
// Comlink で公開
expose(new MandelbrotService());
