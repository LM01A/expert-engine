<!-- 
 Copyright 2022 DigitalOcean 
  
 This code is licensed under the MIT License. 
 You may obtain a copy of the License at 
 https://github.com/digitalocean/nginxconfig.io/blob/master/LICENSE or https://mit-license.org/ 
  
 Permission is hereby granted, free of charge, to any person obtaining a copy 
 of this software and associated documentation files (the "Software"), to deal 
 in the Software without restriction, including without limitation the rights 
 to use, copy, modify, merge, publish, distribute, sublicense, and / or sell 
 copies of the Software, and to permit persons to whom the Software is 
 furnished to do so, subject to the following conditions : 
  
 The above copyright notice and this permission notice shall be included in 
 all copies or substantial portions of the Software. 
  
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE 
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
 THE SOFTWARE. 
 --> 
  
 <template> 
     <div> 
         <p> 
             <b>{{ $t('templates.setupSections.goLive.letsGoLive') }}</b> 🎉 
         </p> 
         <p> 
             {{ $t('templates.setupSections.goLive.reloadNginxToLoadInYourNewConfiguration') }} 
             <br /> 
             <BashPrism 
                 cmd="sudo nginx -t && sudo systemctl reload nginx" 
                 @copied="codeCopiedEvent('Reload nginx')" 
             ></BashPrism> 
         </p> 
     </div> 
 </template> 
  
 <script> 
     import BashPrism from '../prism/bash'; 
     import analytics from '../../util/analytics'; 
  
     export default { 
         name: 'SetupGoLive', 
         display: 'templates.setupSections.goLive.goLive', // i18n key 
         key: 'goLive', 
         components: { 
             BashPrism, 
         }, 
         props: { 
             data: Object, 
         }, 
         methods: { 
             codeCopiedEvent(step) { 
                 analytics({ 
                     category: 'Setup', 
                     action: 'Code snippet copied', 
                     label: `goLive: ${step}`, 
                 }); 
             }, 
         }, 
     }; 
 </script>
