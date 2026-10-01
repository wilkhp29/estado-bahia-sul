export function normalizeMunicipality(value:string){return value.trim().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();}
export function selectedMunicipality<T extends {id:string|null;name:string}>(municipalities:readonly T[],id:string|null,pendingName:string|null):T|null{
 if(id)return municipalities.find(item=>item.id===id)??null;
 if(pendingName)return municipalities.find(item=>!item.id&&item.name===pendingName)??null;
 return null;
}
