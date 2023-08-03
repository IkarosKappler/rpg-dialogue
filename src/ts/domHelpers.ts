/**
 * A script for demonstrating the line-point-distance.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2023-08-01
 * @version  1.0.0
 **/

import { EditorHelper } from "./editorHelpers";
import { IAnswer, IDialogueConfig, IDialogueGraph, IMiniQuestionaire, IMiniQuestionaireWithPosition } from "./interfaces";

export class RPGDOMHelpers {
  editorHelpers: EditorHelper;

  editorElement: HTMLDivElement;
  keyElement: HTMLInputElement;
  qElement: HTMLInputElement;

  optionsElement: HTMLDivElement;

  currentNodeName: string | null;
  currentGraphNode: IMiniQuestionaire;

  constructor(editorHelpers: EditorHelper) {
    this.editorHelpers = editorHelpers;

    this.editorElement = document.getElementById("attribute-editor") as HTMLDivElement;
    this.optionsElement = document.getElementById("e-options-container") as HTMLDivElement;

    this.keyElement = this.editorElement.querySelector("input#e-key");
    this.qElement = this.editorElement.querySelector("input#e-q");

    this.qElement.addEventListener("change", this.handleQChanged(this));
    this.keyElement.addEventListener("change", this.handleKeyChanged(this));

    document.getElementById("b-export-json").addEventListener("click", this.exportJSON(this));
    document.getElementById("b-add-answer-option").addEventListener("click", this.addAnswerOption(this));
    document.getElementById("b-add-dialogue-node").addEventListener("click", this.addDialogueNode(this));
    document.getElementById("b-delete-dialogue-node").addEventListener("click", this.removeDialogueNode(this));
  }

  exportJSON(_self: RPGDOMHelpers): () => void {
    return () => {
      const jsonString = JSON.stringify(_self.editorHelpers.dialogConfigWithPositions);
      var blob = new Blob([jsonString], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "dialog-config.json";
      a.textContent = "Download backup.json";
      a.click();
    };
  }

  addAnswerOption(_self: RPGDOMHelpers): () => void {
    return () => {
      const newOption: IAnswer = {
        a: "",
        next: null
      };
      _self.currentGraphNode.o.push(newOption);
      _self.updateAnswerOptions();
      _self.editorHelpers.pb.redraw();
    };
  }

  private addDialogueNode(_self: RPGDOMHelpers): () => void {
    return () => {
      _self.editorHelpers.addNewDialogueNode();
    };
  }

  private removeDialogueNode(_self: RPGDOMHelpers): () => void {
    return () => {
      _self.editorHelpers.removeNewDialogueNode(_self.currentNodeName);
      _self.toggleVisibility(false);
    };
  }

  toggleVisibility(isVisible: boolean) {
    if (isVisible) {
      this.editorElement.classList.remove("d-none");
    } else {
      this.editorElement.classList.add("d-none");
    }
  }

  private handleQChanged(_self: RPGDOMHelpers): (changeEvent: Event) => void {
    return (changeEvent: Event) => {
      _self.currentGraphNode.q = (changeEvent.target as HTMLInputElement).value;
      _self.editorHelpers.pb.redraw();
    };
  }

  private handleKeyChanged(_self: RPGDOMHelpers): (changeEvent: Event) => void {
    return (_changeEvent: Event) => {
      let newName: string = this.keyElement.value;
      if (!newName || (newName = newName.trim()).length === 0) {
        return;
      }
      const renameSuccessful = _self.editorHelpers.renameGraphNode(_self.currentNodeName, newName);
      if (renameSuccessful) {
        _self.currentNodeName = newName;
      }
    };
  }

  private handleATextChanged(_self: RPGDOMHelpers, answer: IAnswer): (changeEvent: Event) => void {
    return (changeEvent: Event) => {
      answer.a = (changeEvent.target as HTMLInputElement).value;
      _self.editorHelpers.pb.redraw();
    };
  }

  private handleASuccessorChanged(_self: RPGDOMHelpers, answer: IAnswer): (changeEvent: Event) => void {
    return (changeEvent: Event) => {
      answer.next = (changeEvent.target as HTMLInputElement).value;
      _self.editorHelpers.pb.redraw();
    };
  }

  updateAnswerOptions() {
    this.showAnswerOptions(this.currentNodeName, this.currentGraphNode);
  }

  showAnswerOptions(nodeName: string, graphNode: IMiniQuestionaireWithPosition | null) {
    const _self = this;
    this.currentNodeName = nodeName;
    this.currentGraphNode = graphNode;

    this.keyElement.setAttribute("value", nodeName ? nodeName : "");
    this.keyElement.value = nodeName ? nodeName : "";
    this.qElement.setAttribute("value", graphNode ? graphNode.q : "");
    this.qElement.value = graphNode ? graphNode.q : "";
    this.optionsElement.innerHTML = "";
    if (!graphNode) {
      return;
    }

    const onDragOver = (ev: DragEvent) => {
      console.log("ondragover", ev.target);
      ev.preventDefault();
      const target = ev.target as HTMLDivElement;
      const answerIndex = parseInt(ev.dataTransfer.getData("answerindex"));
      const dropIndex = parseInt(target.getAttribute("data-dropindex"));
      if (target.classList.contains("droppable") && answerIndex !== dropIndex && answerIndex + 1 !== dropIndex) {
        target.classList.add("dragover");
      }
    };
    const onDragLeave = (ev: DragEvent) => {
      console.log("ondragleave", ev.target);
      ev.preventDefault();
      const target = ev.target as HTMLDivElement;
      if (target.classList.contains("droppable")) {
        target.classList.remove("dragover");
      }
    };
    const drop = (ev: DragEvent) => {
      console.log("Drop", ev);
      ev.preventDefault();
      const target = ev.target as HTMLDivElement;
      const answerIndex = parseInt(ev.dataTransfer.getData("answerindex"));
      var dropIndex = parseInt(target.getAttribute("data-dropindex"));
      console.log("Move", answerIndex, "to", dropIndex);
      // target.appendChild(document.getElementById(data));

      if (!target.classList.contains("droppable") || answerIndex === dropIndex || answerIndex + 1 === dropIndex) {
        // No real change
        return;
      }
      if (dropIndex > answerIndex) {
        dropIndex--;
      }

      const old = this.currentGraphNode.o[answerIndex];
      this.currentGraphNode.o[answerIndex] = this.currentGraphNode.o[dropIndex];
      this.currentGraphNode.o[dropIndex] = old;

      // Re-build the list : )
      _self.updateAnswerOptions();
      _self.editorHelpers.pb.redraw();
    };

    const dropArea = this.makeADropArea(0, drop, onDragOver, onDragLeave);
    this.optionsElement.appendChild(dropArea);

    for (var i = 0; i < graphNode.o.length; i++) {
      const option: IAnswer = graphNode.o[i];

      const answerWrapperElement = document.createElement("div") as HTMLDivElement;
      const answerControlsElement = this.makeAnswerControlElement(i);

      const answerElement = document.createElement("div") as HTMLDivElement;
      const labelElement = document.createElement("div") as HTMLDivElement;
      const textElement = document.createElement("input") as HTMLInputElement;
      const selectElement = this.createNodeSelectElement(nodeName, option.next);
      labelElement.innerHTML = `A#${i}`;
      labelElement.classList.add("e-label");
      textElement.setAttribute("value", option.a);

      answerElement.appendChild(labelElement);
      answerElement.appendChild(textElement);
      answerElement.appendChild(selectElement);

      const handleDrag = ev => {
        ev.dataTransfer.setData("answerindex", ev.target.getAttribute("data-answerindex"));
      };

      answerWrapperElement.classList.add("answer-wrapper-element");
      answerWrapperElement.setAttribute("draggable", "true");
      answerWrapperElement.setAttribute("data-answerindex", `${i}`);
      answerWrapperElement.addEventListener("dragstart", handleDrag);
      answerWrapperElement.appendChild(answerElement);
      answerWrapperElement.appendChild(answerControlsElement);

      const dropArea = this.makeADropArea(i + 1, drop, onDragOver, onDragLeave);

      this.optionsElement.appendChild(answerWrapperElement);
      this.optionsElement.appendChild(dropArea);

      textElement.addEventListener("change", this.handleATextChanged(this, option));
      selectElement.addEventListener("change", this.handleASuccessorChanged(this, option));
    }

    // Add 'add' button
  }

  private makeAnswerControlElement(index: number) {
    const controlElement = document.createElement("div") as HTMLDivElement;
    const dndElement = document.createElement("div") as HTMLDivElement;
    dndElement.classList.add("a-dnd-element");
    dndElement.innerHTML = "&vellip;";
    const deleteButton = document.createElement("button") as HTMLButtonElement;
    deleteButton.classList.add("a-delete-button");
    deleteButton.addEventListener("click", this.handleDelete(index));
    deleteButton.innerHTML = "&#x1F5D1;";

    controlElement.classList.add("answer-controls-element");

    controlElement.appendChild(dndElement);
    controlElement.appendChild(deleteButton);
    return controlElement;
  }

  private handleDelete(index: number): () => void {
    const _self = this;
    return () => {
      _self.currentGraphNode.o.splice(index, 1);
      _self.updateAnswerOptions();
      _self.editorHelpers.pb.redraw();
    };
  }

  private makeADropArea(
    dropIndex: number,
    drop: (evt: DragEvent) => void,
    onDragOver: (evt: DragEvent) => void,
    onDragLeave: (evt: DragEvent) => void
  ) {
    const dropArea = document.createElement("div");
    dropArea.setAttribute("data-dropindex", `${dropIndex}`);
    dropArea.classList.add("a-droparea", "droppable");
    dropArea.addEventListener("drop", drop);
    dropArea.addEventListener("dragover", onDragOver);
    dropArea.addEventListener("dragleave", onDragLeave);
    return dropArea;
  }

  private createNodeSelectElement(currentKey: string, selectedKey): HTMLSelectElement {
    const selectElement = document.createElement("select") as HTMLSelectElement;
    if (!this.editorHelpers.dialogConfigWithPositions) {
      console.warn("Warning: cannout populate nodeSelectElement. No dialogConfig set.");
    } else {
      const optionElement = this.createNodeSelectOptionElement("", false, null, false);
      selectElement.appendChild(optionElement);

      for (var key in this.editorHelpers.dialogConfigWithPositions.graph) {
        if (!this.editorHelpers.dialogConfigWithPositions.graph.hasOwnProperty(key)) {
          return;
        }
        const questionaire: IMiniQuestionaire = this.editorHelpers.dialogConfigWithPositions.graph[key];
        const optionElement = this.createNodeSelectOptionElement(questionaire.q, key === currentKey, key, key === selectedKey);

        selectElement.appendChild(optionElement);
      }
    }
    return selectElement;
  }

  private createNodeSelectOptionElement(questionaireText: string, isCurrent: boolean, key: string | null, isSelected: boolean) {
    const optionElement = document.createElement("option") as HTMLOptionElement;
    optionElement.setAttribute("value", key);
    optionElement.innerHTML = `${key ?? ""}: ${EditorHelper.ellipsify(questionaireText, 20)}`;
    if (isCurrent) {
      optionElement.setAttribute("disabled", "true");
    }
    if (isSelected) {
      optionElement.setAttribute("selected", "true");
    }
    return optionElement;
  }
}
