import {Property} from "../util/property"
import {Language, Template} from "./language";

export class AppModel {
    languages = new Property<Language[]>([]);
    language = new Property<Language>(Language.EMPTY);
    template = new Property<Template>(Template.EMPTY);
    useSocket = new Property<boolean>(true);
    codeContent = new Property<string>("");
}

export class AppProp {
    constructor(
        public model: AppModel
    ) {
    }
}