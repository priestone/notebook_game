import React from "react";
import { Character } from "../types/game";

interface CharacterInfoProps {
  character: Character;
}

const CharacterInfo: React.FC<CharacterInfoProps> = ({ character }) => {
  return (
    <div className="character-info">
      <h2>{character.name}</h2>
      <div className="level-info">
        <p>레벨: {character.level}</p>
        <p>경험치: {character.experience}</p>
      </div>
      <div className="stats">
        <h3>능력치</h3>
        <ul>
          <li>힘: {character.stats.strength}</li>
          <li>민첩: {character.stats.agility}</li>
          <li>지능: {character.stats.intelligence}</li>
          <li>체력: {character.stats.health}</li>
        </ul>
      </div>
      <div className="equipment">
        <h3>장비</h3>
        <ul>
          <li>무기: {character.equipment.weapon?.name || "없음"}</li>
          <li>방어구: {character.equipment.armor?.name || "없음"}</li>
          <li>장신구: {character.equipment.accessory?.name || "없음"}</li>
        </ul>
      </div>
    </div>
  );
};

export default CharacterInfo;
