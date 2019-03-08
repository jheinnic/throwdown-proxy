export enum LocationRole {
   PUBLIC_KEY_STORE,
   PRIVATE_KEY_STORE,
   /**
    * Implies a common location for PUBLIC_KEY_STORE and PRIVATE_KEY_STORE.  Usually post-staging
    * publication.
    */
   KEY_PAIR_STORE,

   FULL_ART_STORE,
   THUMB_ART_STORE,
   /**
    * Implies a common location for FULL_ART_STORE and THUMB_ART_STORE.  Usually post-staging
    * publication.
    */
   ARTWORK_STORE
}
