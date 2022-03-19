const models = require('../model')

const profileById = id => {
  const { Profile } = models
  const profile = Profile.findOne({ where: { id: id }})

  return profile
}

const updateProfileBalance =  profile => {
  const { Profile } = models

  const { id, balance } = profile
  Profile.update({ balance }, { where: { id: id }})
}

module.exports = {
  profileById,
  updateProfileBalance
}