<script setup lang="ts">
import HttpRequest from './utils/HttpRequest';
import { GUILD_ID } from './utils/constant';
import { onMounted, ref } from 'vue'
import dayjs from "dayjs"
const memeberList = ref<any[]>([])
const date = dayjs().add(-2,"day").format("YYYY-MM-DD")

const requestCharacherId = (characterName: string) => {
  return HttpRequest.request({
    url: "/maplestory/v1/id",
    params: {
      character_name: characterName
    }
  })
} 

const requestUnionInfo = (ocid: string) => {
  return HttpRequest.request({
    url: "/maplestory/v1/ranking/union",
    params: {
      ocid,
      world_name: "루나",
      date,
      page: 1,
    }
  })
} 

const init = async() => {
  const guildList = await HttpRequest.request({
    url: "/maplestory/v1/guild/basic",
    params: {
      oguild_id: GUILD_ID,
      date: date
    }
  })

  const {guild_member} = guildList
  const repCharList: any[] = []
  for(const characterName of guild_member){
    try {
      const {ocid} = await requestCharacherId(characterName)      
      const {ranking} = await requestUnionInfo(ocid)
      const luna_unionInfo = ranking.find((item: any) => item.world_name === "루나")
      const obj = repCharList.find(item => item.character_name === luna_unionInfo.character_name)
      if(obj) {
        obj.charList.push(characterName)
      } else {
        repCharList.push({
          ...luna_unionInfo,
          charList: [characterName]
        })
      }
    } catch (error) {
      console.log("정보없음", error) 
    }
  }

  console.log("repCharList",repCharList)
  memeberList.value = repCharList
}
onMounted(()=> {
  init()
})


</script>

<template>
 
  <div class="wrap">
    <div class="card" v-for="member of memeberList" :key="member">
      <div class="title">{{member.character_name}}</div>
      <div class="body">
        <p v-for="name of member.charList" :key="`${member.character_name}${name}`">{{ name }}</p>
      </div>
    </div>
   
  </div>
</template>
<style>

</style>
