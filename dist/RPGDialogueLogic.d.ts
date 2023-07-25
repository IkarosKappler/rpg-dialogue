/**
 * @author  Ikaros Kappler
 * @date    2023-07-25
 * @version 1.0.0
 */
import { IDialogueStructure, IMiniQuestionaire } from "./interfaces";
export declare class RPGDialogueLogic {
    name: string;
    structure: IDialogueStructure;
    private currentQuestionaire;
    constructor(dialogueStruct: IDialogueStructure, validateStructure: boolean);
    loadCurrentQuestionaire(setQuestionText: (questionText: string) => void, addOptionNode: (answerText: string, index: number) => void): boolean;
    /**
     * Get the current mini questionaire or null if no current or next questionaire is available.
     * @returns
     */
    getCurrentQuestionaire(): IMiniQuestionaire | undefined;
    /**
     * Check if the end was reached or if there are more questions available
     * @returns {boolean} false if there is a current question active.
     */
    isEndReached(): boolean;
    /**
     * Give an answer to the current questionaire. Only valid answer indices will be acceped.
     * @param {number} index
     * @returns {boolean} true if the the index is valid.
     */
    sendAnswer(index: number): boolean;
    /**
     * Find the initial mini questionaire.
     */
    resetToBeginning(): void;
    /**
     * Check if the current dialogue is still valid or reached its end.
     */
    private validate;
    /**
     * This is a convenient function for quickly integrating the dialogue logic into
     * an existing HTML document with prepared two <div> elements for displaying
     * the question and possible answers.
     *
     * @param {string} questionNodeId
     * @param {string} optionsNodeId
     * @returns
     */
    beginConversation(questionNodeId: string, optionsNodeId: string): Promise<boolean>;
    /**
     * Load the dialogue structure from the JSON document at the given path.
     *
     * @param {string} path
     * @returns {Promise<RPGDialogueLogic>}
     */
    static loadStructureFromJSON(path: string): Promise<IDialogueStructure>;
    /**
     * Load the dialogue structure from the JSON document at the given path.
     *
     * @param {string} path
     * @returns {Promise<RPGDialogueLogic>}
     */
    static loadFromJSON(path: string): Promise<RPGDialogueLogic>;
}
