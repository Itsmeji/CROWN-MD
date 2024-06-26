const moment = require('moment-timezone')
moment.tz.setDefault(global.timezone)
exports.run = {
   usage: ['groupinfo'],
   hidden: ['gcinfo'],
   category: 'group',
   async: async (m, {
      client,
      participants,
      Func
   }) => {
      try {
         let setting = global.db.groups.find(v => v.jid == m.chat)
         var pic = await Func.fetchBuffer('./media/image/default.jpg')
         let meta = await (await client.groupMetadata(m.chat))
         let admin = await client.groupAdmin(m.chat)
         let member = participants.map(u => u.id)
         try {
            var pic = await Func.fetchBuffer(await client.profilePictureUrl(m.chat, 'image'))
         } catch {} finally {
            let caption = `乂  *G R O U P - I N F O*\n\n`
            caption += `	◦  *Nom* : ${meta.subject}\n`
            caption += `	◦  *Membre* : ${member.length}\n`
            caption += `	◦  *Administrateur* : ${admin.length}\n`
            caption += `	◦  *Créé* : ${moment(meta.creation * 1000).format('DD/MM/YY HH:mm:ss')}\n`
            caption += `	◦  *Propriétaire* : ${meta.owner ? '@' + meta.owner.split('@')[0] : m.chat.match('-') ? '@' + m.chat.split('-')[0] : ''}\n\n`
            caption += `乂  *M O D E R A T I O N*\n\n`
            caption += `	◦  ${Func.switcher(setting.antidelete, '[ √ ]', '[ × ]')} Anti-suppression\n`
            caption += `	◦  ${Func.switcher(setting.antilink, '[ √ ]', '[ × ]')} Anti-lien\n`
            caption += `	◦  ${Func.switcher(setting.antivirtex, '[ √ ]', '[ × ]')} Anti Virtex\n`
            caption += `	◦  ${Func.switcher(setting.filter, '[ √ ]', '[ × ]')} Filtre\n`
            caption += `	◦  ${Func.switcher(setting.autosticker, '[ √ ]', '[ × ]')} Autocollant automatique\n`
            caption += `	◦  ${Func.switcher(setting.left, '[ √ ]', '[ × ]')} Message laissé\n`
            caption += `	◦  ${Func.switcher(setting.localonly, '[ √ ]', '[ × ]')} Local uniquement\n`
            caption += `	◦  ${Func.switcher(setting.viewonce, '[ √ ]', '[ × ]')} Viewonce Forwardeur\n`
            caption += `	◦  ${Func.switcher(setting.welcome, '[ √ ]', '[ × ]')} Message de bienvenue\n\n`
            caption += `乂  *G R O U P - S T A T U S*\n\n`
            caption += `	◦  *En sourdine* : ${Func.switcher(setting.mute, '√', '×')}\n`
            caption += `	◦  *Rester* : ${Func.switcher(setting.stay, '√', '×')}\n`
            caption += `	◦  *Expiré* : ${setting.expired == 0 ? 'PAS ENCORE DÉFINI' : Func.timeReverse(setting.expired - new Date * 1)}\n\n`
            caption += global.footer
            client.sendMessageModify(m.chat, caption, m, {
               largeThumb: true,
               thumbnail: pic,
            })
         }
      } catch (e) {
         console.log(e)
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   group: true,
   cache: true,
   location: __filename
}